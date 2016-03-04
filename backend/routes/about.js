exports.get = function(req, res) {

    if (req.user) {
        res.render('about', {
            name: req.user.get('name'),
            title_name: 'Quiz | О проекте'
        });
    } else {
        res.render('about');
    }

};