var path = require('path');

exports.get = function(req, res) {
    if (req.user) {
        res.sendFile(path.resolve('frontend/game/index.html'));
    } else {
        res.redirect('/');
    }
};