exports.get = function(req, res) {

    if (req.user) {
        res.render('about', {
            name: req.user.get('name')
        });
    } else {
        res.render('about');
    }

};