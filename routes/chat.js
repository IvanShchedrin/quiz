exports.get = function(req, res) {
    if (req.user) {
        res.render('chat', {
            name: req.user.get('name')
        });
    } else {
        res.render('chat');
    }

};