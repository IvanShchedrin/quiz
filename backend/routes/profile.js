exports.get = function(req, res) {
    if (req.user) {
        res.render('profile', req.user)
    } else {
        res.redirect('/');
    }
};