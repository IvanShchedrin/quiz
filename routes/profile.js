exports.get = function(req, res) {
    if (req.user) {
        if (req.user.accStatus == 0) {
            res.redirect('/registry');
        } else {
            res.render('game', {
                layout: false,
                username: req.user.get('name'),
                title_name: 'Quiz'
            });
        }
    } else {
        res.redirect('/');
    }
};