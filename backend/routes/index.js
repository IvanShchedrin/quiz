var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {

    app.get('/', require('./frontpage').get);
    app.get('/about', require('./about').get);
    app.get('/registry', require('./registry').get);
    app.get('/profile', checkAuth, require('./profile').get);
    app.get('/game', checkAuth, require('./game').get);

    app.post('/', require('./frontpage').post);
    app.post('/registry', require('./registry').post);
    app.post('/logout', require('./logout').post);


};