var User = require('models/user').User;
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;

exports.get = function(req, res) {
    if (req.user) {
        res.render('frontpage', {
            name: req.user.get('name'),
            title_name: 'Quiz | Главная'
        });
    } else {
        res.render('frontpage');
    }
};

exports.post = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.authorize(username, password, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message))
            } else {
                return next(err)
            }
        }

        req.session.user = user._id;
        res.end();
    });
};