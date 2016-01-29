var cookie = require('cookie');
var config = require('config');
var cookieParser = require('cookie-parser');
var sessionStore = require('libs/sessionStore');
var HttpError = require('error').HttpError;
var User = require('models/user').User;
var Question = require('models/question').Question;

var _numUser = 0;
var _answer = '';
var _question = '';
var _currentTheme = '';
// 0 - stopped, 1 - get ready, 2 - answering, 3 - somebody answered, 4 - nobody answered, 5 - choosing theme
var _gameState = 0;
//var _delayStarted = 0;
var _answerDelay = 5000;

function loadUser(session, callback) {
    if (!session.user) {
        console.log('Session %s is anonymous', session.id);
        return new HttpError(401, '401');
    }

    console.log('Retrieving user: ', session.user);

    User.findById(session.user, function(err, user) {
        if (err) return err;

        if (!user) {
            return new HttpError(401, '401');
        }

        callback(user);
    });
}

function getReady(io) {
    _currentTheme = 'Все подряд ' + Math.random();
    _gameState = 1;
    io.sockets.emit('get ready', {
        timer: _answerDelay,
        theme: _currentTheme
    });
    //_delayStarted = new Date().getTime();

    Question.getRandQuestion(function(err, question) {
        if (err) {

        }
        _question = question.question;
        _answer = question.answer.toUpperCase();
    });
}

function answering(io) {
    if (_gameState == 0) {
        return;
    }

    _gameState = 2;
    io.sockets.emit('new question', {
        question: _question,
        letters: getHintWord(0),
        timer: _answerDelay
    });
    //_delayStarted = new Date().getTime();

    var hintCount = 1;

    var wordTimeout = setTimeout(function() {
        if (_gameState === 2) {
            _gameState = 4;
        }
    }, _answerDelay * _answer.length - 20);

    var hintInterval = setInterval(function() {
        if (_gameState === 2) {
            io.sockets.emit('hint', {
                letters: getHintWord(hintCount),
                timer: _answerDelay
            });
            //_delayStarted = new Date().getTime();
            hintCount ++;
            return;
        }
        if (_gameState === 4) {
            clearInterval(hintInterval);
            io.sockets.emit('right answer', {
                answer: _answer
            });
            setTimeout(function() {
                startGame(io);
            }, _answerDelay);
            return;
        }

        clearTimeout(wordTimeout);
        clearInterval(hintInterval);
    }, _answerDelay);

}

function getHintWord(count) {
    var word = _answer.substring(0, count);
    while(count < _answer.length) {
        word += '*';
        count++;
    }
    return word;
}

function rightAnswer(io, socket) {
    _gameState = 3;
    socket.broadcast.emit('right answer', {
        name: socket.handshake.user.name,
        answer: _answer,
        score: 13
    });
    socket.emit('you right', {
        answer: _answer,
        score: 13
    });

    setTimeout(function() {
        _gameState = 5;
        _currentTheme = '';
        socket.emit('choose theme', {
            themes: ['животные', 'история России', 'физика', 'Барак Обама'],
            timer: _answerDelay
        });
        socket.broadcast.emit('wait theme', {
            name: socket.handshake.user.name,
            timer: _answerDelay
        });
        //_delayStarted = new Date().getTime();

        setTimeout(function() {
            if (_gameState !== 5) {
                return;
            }
            if (_currentTheme === '') {
                _currentTheme = 'бороды мира';
            }

            startGame(io);
        }, _answerDelay)
    }, _answerDelay)

}

function startGame(io) {
    console.log('Game started. State: ' + _gameState);
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
            theme: _currentTheme,
            question: _question,
            gameState: _gameState
        });
        socket.broadcast.emit('somebody conn', {
            usersOnline: _numUser,
            name: socket.handshake.user.name
        });

        socket
            .on('answer', function(answer) {

                if (_gameState === 2) {
                    if (_answer == answer.toUpperCase()) {
                        rightAnswer(io, socket);
                    } else {
                        io.sockets.emit('wrong answer', {
                            name: socket.handshake.user.name,
                            answer: answer.toUpperCase()
                        })
                    }
                } else if (_gameState === 3) {
                    socket.emit('too late', {
                        server: 'Слишком поздно. Ответ уже кто-то угадал'
                    })
                } else if (_gameState === 4) {
                    socket.emit('too late', {
                        server: 'Слишком поздно. Время на ответ закончилось'
                    })
                }
            })
            .on('choosen theme', function(theme) {
                if (_gameState === 5) {
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