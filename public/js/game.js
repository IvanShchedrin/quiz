$(function() {
    var socket = io.connect('', {
        'reconnectionDelay': 125,
        'reconnectionDelayMax': 500
    });
    var $question = $('.game-wrap .question span');
    var $answerForm = $('.game-wrap .answer-wrap form');
    var $variants = $('.game-wrap .variants-wrap');
    var $letters = $('.game-wrap .letters-wrap span');
    var $timer = $('.game-wrap .answer-wrap .timer');
    var $online = $('.game-wrap .question-wrap .users-online span');
    var $theme = $('.game-wrap .question-wrap .theme span');
    var $error = $('.game-wrap .answer-wrap .server-message');
    var $chatTextarea = $('.chat-wrap .input-box textarea');
    var $chatMessages = $('.chat-wrap .message-box');

    var _question = '';
    var _theme = '';
    var _name = '';

    $('.answer-wrap .game-control .start').on('click', function() {
        socket.emit('start game');
    });
    $('.answer-wrap .game-control .stop').on('click', function() {
        socket.emit('stop game');
    });
    $('#log_out').on('click', function() {
        $('<form method=POST action=/logout>').submit();
        return false;
    });

    $chatMessages.scrollTop(1000000);

    $answerForm.submit(function (e) {
        e.preventDefault();

        var input = $(this).find(':input');
        var answer = input.val();

        socket.emit('answer', answer);

        input.val('');

        return false;
    });

    $('.chat-wrap .input-box form').submit(function(e) {
        e.preventDefault();
        sendMessage($chatTextarea.val());
        $chatTextarea.val('');
    });

    $chatTextarea.keypress(function (e) {
        if(e.which == 13) {
            e.preventDefault();
            $('.chat-wrap .input-box form').submit();
        }
    });

    function setTimer(time) {
        if (!time) return;
        time = time / 1000 - 1;
        $timer.show();
        $timer.html(time);

        var timerId = setInterval(function() {
            time -= 1;
            $timer.html(time);
        }, 1000);

        setTimeout(function() {
            clearInterval(timerId);
            $timer.html(0);
        }, (time * 1000) - 5);
    }

    function addMessage(name, text) {
        if (!name || !text) return;
        text = text.slice(0, 255);

        var div = $('<div/>').addClass('message');
        var inDiv = $('<div/>').addClass('name');
        $('<span/>', {html: name}).appendTo(inDiv);
        inDiv.appendTo(div);

        inDiv = $('<div/>').addClass('text');
        $('<span/>', {html: text}).appendTo(inDiv);
        inDiv.appendTo(div);
        div.appendTo($chatMessages);
        $chatMessages.scrollTop(1000000);

        if (name == _name) $chatMessages.children().last().addClass('me');
    }

    function sendMessage(text) {
        if (!text) return;
        text = text.slice(0, 255);

        socket.emit('chat message', {
            name: _name,
            text: text
        })
    }

    socket
        .on('logout', function () {
            location.href = '/';
        })
        .on('new message', function(msg) {
            addMessage(msg.name, msg.text);
        })
        .on('hint', function (msg) {
            if ($question.html() == '') {
                $question.html(_question);
            }
            if ($theme.html() == '') {
                if (_theme != '') {
                    $theme.html(_theme);
                }
            }

            $timer.show();
            $letters.text(msg.letters);
            setTimer(msg.timer);
        })
        .on('wrong answer', function (msg) {
            var div = $('<div/>').addClass('variants');
            var ul = $('<ul/>');

            $('<li/>', {html: msg.name}).appendTo(ul);
            $('<li/>', {html: ': ' + msg.answer}).appendTo(ul);
            ul.appendTo(div);
            div.appendTo($variants);
        })
        .on('right answer', function (msg) {
            var div = $('<div/>').addClass('right-answer');
            $letters.html(msg.answer.toUpperCase());
            $variants.empty();

            if (msg.name) {
                $('<span/>', {
                    html:   'Правильно ответил: <b>' + msg.name + '</b><br>Количество заработанных очков: <b>' +
                            msg.score + '</b>.<br>Общий счет: ' + msg.totalScore
                }).appendTo(div);
            } else {
                $('<span/>', {
                    html: 'К сожалению, правильно никто так и не ответил.'
                }).appendTo(div);
            }

            div.appendTo($variants);
            $timer.hide();
        })
        .on('you right', function (msg) {
            var div = $('<div/>').addClass('right-answer');

            $letters.html(msg.answer.toUpperCase());
            $variants.empty();

            $('<span/>', {
                html:   'Правильный ответ!<br>Количество заработанных очков: <b>' + msg.score + '</b>.<br>Общий счет: ' +
                        msg.totalScore
            }).appendTo(div);

            div.appendTo($variants);
            $timer.hide();
        })
        .on('new question', function (msg) {
            $question.text(msg.question);
            $letters.text(msg.letters);
            $variants.empty();
            $error.empty();
            setTimer(msg.timer);
        })
        .on('get ready', function(msg) {
            $question.text('Приготовься к следующему вопросу.');
            $letters.empty();
            $error.empty();
            setTimer(msg.timer);
            $timer.show();
            $variants.empty();
            if (msg.theme == '') {
                $theme.html('Все подряд')
            } else {
                $theme.html(msg.theme);
            }
        })
        .on('wait theme', function(msg) {
            $question.text('Подожди, пока ' + msg.name + ' выбирает тему');
            $letters.empty();
            $variants.empty();
            setTimer(msg.timer);
        })
        .on('choose theme', function(msg) {
            $variants.empty();
            $question.text('Выберите тему следующего вопроса');
            $letters.empty();
            $error.empty();

            var themes = msg.themes;
            var div = $('<div/>').addClass('themes');

            for (var i = 0; i < themes.length; i++) {
                $('<div/>', {html: themes[i]}).appendTo(div);
            }

            div.appendTo($variants);
            setTimer(msg.timer);
            $timer.show();

            var themeBtns = $variants.find('.themes div');

            themeBtns.on('click', function() {
                socket.emit('chosen theme', this.innerHTML);
                themeBtns.removeClass('clicked');
                $(this).addClass('clicked');
            });
        })
        .on('connected', function(msg) {
            if (msg.gameState == 1) {
                $question.text('Приготовься к следующему вопросу.');
                var div = $('<div/>').addClass('right-answer');
                $('<span/>', {html: 'Тема: ' + msg.theme}).appendTo($variants);
            }

            $online.text('В сети ' + msg.usersOnline);
            _question = msg.question;
            _theme = msg.theme;
            _name = msg.name
        })
        .on('somebody disc', function(msg) {
            $online.text('В сети ' + msg.usersOnline);
        })
        .on('somebody conn', function(msg) {
            $online.text('В сети ' + msg.usersOnline);
        })
        .on('too late', function(msg) {
            switch (msg.gameState) {
                case 1:
                    $error.text('Слишком рано');
                    break;
                case 3:
                    $error.text('Поздно. Ответ уже угадан');
                    break;
                case 4:
                    $error.text('Поздно. Время вышло');
                    break;
                case 5:
                    $error.text('Слишком рано. Идет выбор темы');
                    break;
                case 0:
                    $error.text('Игра выключена');
            }

            if (this.errorTimer) {
                clearTimeout(this.errorTimer);
            }

            this.errorTimer = setTimeout(function() {
                $error.empty();
            }, 3000);
        });

});