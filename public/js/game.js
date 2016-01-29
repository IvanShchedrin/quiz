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

    var _question = '';
    var _theme = '';

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

    $answerForm.submit(function (e) {
        e.preventDefault();

        var input = $(this).find(':input');
        var answer = input.val();

        socket.emit('answer', answer);

        input.val('');

        return false;
    });
    function setTimer(time) {
        if (!time) return;

        time = time / 1000 - 1;

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
    socket
        .on('logout', function () {
            location.href = '/';
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
                    html: 'Правильно ответил: <b>' + msg.name + '</b><br>Получает <b>' + msg.score + '</b> очков'
                }).appendTo(div);
            } else {
                $('<span/>', {
                    html: 'К сожалению, правильно никто так и не ответил.'
                }).appendTo(div);
            }

            div.appendTo($variants);
            $timer.hide();

            $answerForm.find('input').attr('disabled', 'disabled');
            $answerForm.find('button').attr('disabled', 'disabled');
        })
        .on('you right', function (msg) {
            var div = $('<div/>').addClass('right-answer');

            $letters.html(msg.answer.toUpperCase());
            $variants.empty();

            $('<span/>', {
                html: 'Правильный ответ!<br> Вы заработали <b>' + msg.score + '</b> очков'
            }).appendTo(div);

            div.appendTo($variants);
            $timer.hide();

            $answerForm.find('input').attr('disabled', 'disabled');
            $answerForm.find('button').attr('disabled', 'disabled');
        })
        .on('new question', function (msg) {
            $question.text(msg.question);
            $letters.text(msg.letters);
            $variants.empty();

            $answerForm.find('input').removeAttr('disabled');
            $answerForm.find('button').removeAttr('disabled');
            setTimer(msg.timer);
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
        .on('get ready', function(msg) {
            $question.text('Приготовься к следующему вопросу.');
            $letters.empty();
            $theme.html(msg.theme);
            setTimer(msg.timer);
            $timer.show();
            $variants.empty();
        })
        .on('choose theme', function(msg) {
            $variants.empty();
            $question.text('Выберите тему следующего вопроса');
            $letters.empty();

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
                socket.emit('choosen theme', this.innerHTML);
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
        })
        .on('somebody disc', function(msg) {
            $online.text('В сети ' + msg.usersOnline);
        })
        .on('somebody conn', function(msg) {
            $online.text('В сети ' + msg.usersOnline);
        });

});