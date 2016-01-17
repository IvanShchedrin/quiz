var socket = io.connect('', {
    'reconnectionDelay': 125,
    'reconnectionDelayMax': 500
});

var form = $('#room form');
var ul = $('#room ul');

form.submit(function() {
    var input = $(this).find(':input');
    var text = input.val();

    input.val('');

    socket.emit('message', text, function(msg) {
        $('<li>', {text: msg}).appendTo(ul);
    });

    return false;
});

socket
    .on('connect', function() {
        console.log('Connected');
    })
    .on('disconnect', function() {
        console.log('Disconnected');
    })
    .on('message', function(msg) {
    $('<li>', {text: msg}).appendTo(ul);
    })
    .on('connect_timeout', function() {
        alert('Oops, connection lost');
    })
    .on('logout', function() {
        location.href = '/';
    });