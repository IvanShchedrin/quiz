exports.get = function(req, res) {
    if (req.user) {
        res.render('game', {
            layout: false,
            username: req.user.get('name'),
            title_name: 'Quiz'
        });
    } else {
        res.redirect('/');
    }
};