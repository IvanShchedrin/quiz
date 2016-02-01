var User = require('models/user').User;
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;

exports.get = function(req, res, next) {

    if (!req.user) {
        res.render('registry', {
            title_name: 'Quiz | Регистрация'
        });
    } else {
        if (req.user.accStatus == 0) {
            if (req.query.reg == req.user.email.split('_|_')[1]) {
                User.findById(req.session.user, function(err, user) {
                    if (err) return next(err);

                    user.accStatus = 1;
                    user.email = user.email.split('_|_')[0];

                    user.save(function(err) {
                        if (err) return next(err);
                        console.log('Почта подтверждена');
                        res.redirect('/profile');
                    })
                })
            } else {
                res.render('confirm_email', {
                    title_name: 'Quiz | Подтверждение регистрации',
                    email: req.user.email.split('_|_')[0],
                    name: req.user.name
                })
            }
        } else {
            res.redirect('/');
        }
    }
};

exports.post = function(req, res, next) {
    var userData = {
        login: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    User.createUser(userData, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message))
            } else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.end();
    })
};