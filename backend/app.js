var express = require('express');
var app = express();

var http = require('http');
var path = require('path');

var config = require('../config');
var async = require('async');
var HttpError = require('./error').HttpError;
var session = require('express-session');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var mongoose = require('./libs/mongoose');
var log = require('./libs/log')(module);

var sessionStore = require('./libs/sessionStore');

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({
    defaultLayout: 'static',
    layoutsDir: './backend/views/layouts/'
    /*partialsDir: [
        './backend/views/'
    ]*/
}));

app.set('view engine', 'handlebars');

app.use(session({
    secret: config.get('session:secret'),
    resave: config.get('session:resave'),
    saveUninitialized: config.get('session:saveUninitialized'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: sessionStore
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./middleware/sendHTTPError'));
app.use(require('./middleware/loadUser'));

app.use(express.static('./public'));
require('./routes')(app);

app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHTTPError(err);
    } else {
        log.error(err);
        err = new HttpError(500);
        res.sendHTTPError(err);
    }
});

var server = http.createServer(app);
server.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});

var io = require('./socket')(server);
app.set('io', io);