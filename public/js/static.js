$(document).ready(function() {
    $(document.forms['login-form']).on('submit', function() {
        var form = $(this);

        $('.error', form).html('');
        $(':submit', form).button("loading");

        $.ajax({
            url: "/",
            method: "POST",
            data: form.serialize(),
            complete: function() {
                $(":submit", form).button("reset");
            },
            statusCode:{
                200: function() {
                    form.html("You entred the site").addClass('alert-success');
                    window.location.href = "/game";
                },
                403: function(res) {
                    console.log(res.responseText);
                    $('.error', form).html('Wrong login or password');
                }
            }
        });
        return false;
    });

    $('#log_out').on('click', function() {
        $('<form method=POST action=/logout>').submit();
        return false;
    });

});