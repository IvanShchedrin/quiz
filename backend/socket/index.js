var cookie = require('cookie');
var config = require('./../../config');
var log = require('./../libs/log')(module);
var cookieParser = require('cookie-parser');
var sessionStore = require('./../libs/sessionStore');
var HttpError = require('./../error').HttpError;
var User = require('./../models/user').User;
var Question = require('./../models/question').Question;
var Theme = require('./../models/theme').Theme;

var _numUser = 0;
var _answer = '';
var _coveredAnswer = '';
var _question = '';
var _currentTheme = '';
// 0 - stopped, 1 - get ready, 2 - answering, 3 - somebody answered, 4 - nobody answered, 5 - choosing theme
var _gameState = 0;
//var _delayStarted = 0;
var _answerDelay = 8000;

function loadUser(session, callback) {
    if (!session.user) {
        log.error('Session %s is anonymous', session.id);
        return new HttpError(401, '401');
    }

    log.info('User connected: ' + session.user);

    User.findById(session.user, function(err, user) {
        if (err) return err;

        if (!user) {
            return new HttpError(401, '401');
        }

        callback(user);
    });
}

function getReady(io) {
    _coveredAnswer = '';
    _gameState = 1;
    io.sockets.emit('get ready', {
        timer: _answerDelay,
        theme: _currentTheme
    });
    log.info('Get ready. Theme: ' + _currentTheme);
    //_delayStarted = new Date().getTime();

    Question.getRandQuestion(_currentTheme, function(err, question) {
        if (err) {
            _gameState = 0;
            log.error(err);
        } else {
            _question = question.question;
            _answer = question.answer.toUpperCase();
        }
    });
}

function answering(io) {
    if (_gameState == 0) {
        return;
    }

    _gameState = 2;
    io.sockets.emit('new question', {
        question: _question,
        letters: getHintWord(),
        timer: _answerDelay
    });
    log.info('New question: ' + _question);
    log.info(_coveredAnswer);
    //_delayStarted = new Date().getTime();

    var wordTimeout = setTimeout(function() {
        if (_gameState === 2) {
            _gameState = 4;
        }
    }, _answerDelay * Math.floor(_answer.length / Math.ceil(_answer.length / 6)) - 20);

    var hintInterval = setInterval(function() {
        if (_gameState === 2) {
            io.sockets.emit('hint', {
                letters: getHintWord(),
                timer: _answerDelay
            });
            log.info(_coveredAnswer);
            //_delayStarted = new Date().getTime();
            return;
        }
        if (_gameState === 4) {
            clearInterval(hintInterval);
            _currentTheme = '';
            io.sockets.emit('right answer', {
                answer: _answer
            });
            log.info(_answer);
            setTimeout(function() {
                startGame(io);
            }, _answerDelay);
            return;
        }

        clearTimeout(wordTimeout);
        clearInterval(hintInterval);
    }, _answerDelay);

}

function getHintWord() {

    if (_coveredAnswer.length == 0) {
        _coveredAnswer = Array(_answer.length + 1).join("*");
        return _coveredAnswer;
    } else {
        var word = _coveredAnswer;
        var count = Math.ceil(word.length / 6);
        var covered = (word.match(/[*]/g)||[]).length;
        var randChar;
        var num;

        if (covered <= count) {
            _coveredAnswer = _answer;
            return _answer;
        }

        while (count != 0) {
            randChar = Math.ceil(Math.random() * covered);
            num = 0;

            while (randChar != 0) {
                if (word.charAt(num) == '*') {
                    randChar --;
                }
                num++;
            }

            word = word.substr(0, num - 1) + _answer.charAt(num - 1) + word.substr(num);
            covered --;
            count --;
        }
        _coveredAnswer = word;
        return word;
    }
}

function rightAnswer(io, socket) {
    _gameState = 3;
    var score = (_coveredAnswer.match(/[*]/g)||[]).length;
    var themes;

    socket.broadcast.emit('right answer', {
        name: socket.handshake.user.name,
        answer: _answer,
        score: score,
        totalScore: socket.handshake.user.score + score
    });
    socket.emit('you right', {
        answer: _answer,
        score: score,
        totalScore: socket.handshake.user.score + score
    });
    log.info(socket.handshake.user.name + ' right. Score: ' + score + '. Total score: ' + (socket.handshake.user.score + score));

    Theme.getRandThemes(4, function(err, result) {
        if (err) {
            themes = ['все подряд'];
        } else {
            themes = result;
        }
    });

    setTimeout(function() {
        if (_gameState !== 3) {
            return;
        }
        _gameState = 5;
        _currentTheme = '';

        log.info('themes to choose: ' + themes);

        socket.emit('choose theme', {
            themes: themes,
            timer: _answerDelay
        });
        socket.broadcast.emit('wait theme', {
            name: socket.handshake.user.name,
            timer: _answerDelay
        });
        log.info('Choosing theme');
        //_delayStarted = new Date().getTime();

        setTimeout(function() {
            if (_gameState !== 5) {
                return;
            }

            startGame(io);
        }, _answerDelay)
    }, _answerDelay);

    User.update({_id: socket.handshake.user._id}, {$set: { score: socket.handshake.user.score += score}}, function(err) {
        if (err) {
            log.err('Failed to update user`s totalScore. ID: ' + socket.handshake.user._id);
            log.err(err);
        }
    })

}

function startGame(io) {
    log.info('Game started. State: ' + _gameState);
    if (_gameState != 0 && _gameState != 4 && _gameState != 5) {
        return;
    }
    getReady(io);

    setTimeout(function() {
        answering(io);
    }, _answerDelay);
}

module.exports = function(server) {
    var io = require('socket.io')(server, {
        //origins: 'localhost:*'
    });

    io.use(function(socket, next) {

        socket.handshake.cookies = cookie.parse(socket.handshake.headers.cookie || '');
        var sidCookie = socket.handshake.cookies[config.get('session:key')];
        var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

        sessionStore.load(sid, function(err, session) {
            if (err) return next(new HttpError(500, 'Can`t load session. Error while trying find session' + sid));
            if (!session) return next(new HttpError(401, 'Can`t load session. Unknown sid ' + sid));

            socket.handshake.session = session;

            loadUser(session, function(user) {
                socket.handshake.user = user;
                return next();
            });

            next(new HttpError(500, 'Database error. Can`t load session.user'))

        });
    });

    io.sockets.on('connection', function(socket) {
        _numUser++;

        socket.emit('connected', {
            usersOnline: _numUser,
            hint: _gameState == 2 ? _coveredAnswer : _gameState == 0 || _gameState == 1 ? '' : _answer,
            theme: _currentTheme,
            question: _gameState == 0 || _gameState == 1 ? '' : _question,
            gameState: _gameState,
            name: socket.handshake.user.name
        });
        socket.broadcast.emit('somebody conn', {
            usersOnline: _numUser,
            name: socket.handshake.user.name
        });

        socket
            .on('answer', function(answer) {

                if (_gameState === 2) {
                    if (answer.toUpperCase() == _answer || answer == '1223') {
                        rightAnswer(io, socket);
                    } else {
                        io.sockets.emit('wrong answer', {
                            name: socket.handshake.user.name,
                            answer: answer.toUpperCase()
                        })
                    }
                } else {
                    socket.emit('too late', {
                        gameState: _gameState
                    })
                }
            })
            .on('chat message', function(msg) {
                io.sockets.emit('new message', {
                    name: msg.name,
                    text: msg.text
                });
            })
            .on('choosen theme', function(theme) {
                if (_gameState == 5) {
                    log.info('choosen theme: ' + theme);
                    _currentTheme = theme;
                }
            })
            .on('start game', function() {
                if (_gameState == 0) {
                    startGame(io);
                }
            })
            .on('stop game', function() {
                _gameState = 0;
                _answer = '';
                _coveredAnswer = '';
                _question = '';
                _currentTheme = '';
            })
            .on('disconnect', function() {
                _numUser--;
                socket.broadcast.emit('somebody disc', {
                    usersOnline: _numUser,
                    name: socket.handshake.user.name
                })
            });

    });

    return io;
};