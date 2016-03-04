var HttpError = require('../error').HttpError;

module.exports = function(req, res, next) {
    if (req.user) {
        if (req.user.accStatus == 0) {
            res.redirect('/registry');
        } else {
            next();
        }
    } else {
        res.redirect('/registry');
    }
};