exports.get = function(req, res) {
    if (req.user) {
        res.render('game', {
            layout: false,
            name: req.user.get('name'),
            title_name: 'Quiz'
        });
    } else {
        res.redirect('/');
    }
};