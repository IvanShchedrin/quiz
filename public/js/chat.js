var socket = io();

var form = $('#room form');
var ul = $('#room ul');

form.submit(function() {
    var input = $(this).find(':input');
    var text = input.val();

    input.val('');

    for (var i = 0; i < 100000; i++) {
        socket.emit('message', text, function(msg) {
            $('<li>', {text: msg}).appendTo(ul);
        });
    }



    return false;
});

socket.on('message', function(msg) {
    $('<li>', {text: msg}).appendTo(ul);
});

socket.on('connected', function(msg) {
    console.log(msg);
});
