var User = require('models/user').User;
var HttpError = require('error').HttpError;

exports.get = function(req, res, next) {
    User.find({}, function (err, users) {
        if (err) return next(err);
        res.json(users);
    })
};