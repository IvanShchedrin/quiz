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

    $('.answer-wrap .game-control .start').on('click', function() {
        socket.emit('start game');
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
            console.log('socket.in > logout');
            location.href = '/';
        })
        .on('wrong answer', function (msg) {
            console.log('socket.in > wrong answer');
            var div = $('<div/>').addClass('variants');
            var ul = $('<ul/>');

            $('<li/>', {html: msg.name}).appendTo(ul);
            $('<li/>', {html: ': ' + msg.answer}).appendTo(ul);
            ul.appendTo(div);
            div.appendTo($variants);
        })
        .on('right answer', function (msg) {
            console.log('socket.in > right answer');
            var div = $('<div/>').addClass('right-answer');
            $letters.html(msg.answer.toUpperCase());
            $variants.empty();

            if (msg.name) {
                $('<span/>', {
                    html: 'Правильно ответил: <b>' + msg.name + '</b><br>Получает <b>' +
                    msg.score + '</b> очков'
                }).appendTo(div);
            } else {
                $('<span/>', {
                    html: 'К сожалению, правильно никто так и не ответил.'
                }).appendTo(div);
            }

            div.appendTo($variants);

            $answerForm.find('input').attr('disabled', 'disabled');
            $answerForm.find('button').attr('disabled', 'disabled');
        })
        .on('you right', function (msg) {
            console.log('socket.in > you right');
            var div = $('<div/>').addClass('right-answer');

            $letters.html(msg.answer.toUpperCase());
            $variants.empty();

            $('<span/>', {
                html: 'Правильный ответ!<br> Вы заработали <b>' + msg.score + '</b> очков'
            }).appendTo(div);

            div.appendTo($variants);

            $answerForm.find('input').attr('disabled', 'disabled');
            $answerForm.find('button').attr('disabled', 'disabled');
        })
        .on('new question', function (msg) {
            console.log('socket.in > new question');
            $question.text(msg.question);
            $letters.text(msg.letters);
            $variants.empty();

            $answerForm.find('input').removeAttr('disabled');
            $answerForm.find('button').removeAttr('disabled');
            setTimer(msg.timer);
        })
        .on('hint', function (msg) {
            console.log('socket.in > hint');
            $letters.text(msg.letters);
            setTimer(msg.timer);
        })
        .on('get ready', function(msg) {
            console.log('socket.in > get ready');
            setTimer(msg.timer);
        });

});