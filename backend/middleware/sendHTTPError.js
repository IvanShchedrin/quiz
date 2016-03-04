module.exports = function(req, res, next) {
    res.sendHTTPError = function(error) {
        res.status(error.status);
        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            res.json(error);
        } else {
            res.render('error', {
                error_code: error.status,
                error_message: error
            });
        }
    };
    next();
};