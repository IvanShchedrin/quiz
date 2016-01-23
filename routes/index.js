var checkAuth = require('middleware/checkAuth');

module.exports = function(app) {

    app.get('/', require('./frontpage').get);
    app.post('/', require('./frontpage').post);

    app.post('/logout', require('./logout').post);

    app.get('/game', checkAuth, require('./game').get);

    app.get('/about', require('./about').get);

    app.get('/users', require('./users').get);

};