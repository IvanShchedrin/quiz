var express = require('express');
var app = express();

var http = require('http');
var path = require('path');

var config = require('config');
var log = require('libs/log')(module);
var HttpError = require('error').HttpError;
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs  = require('express-handlebars');
var mongoose = require('libs/mongoose');
var MongoStore = require('connect-mongo')(session);


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(session({
    secret: config.get('session:secret'),
    resave: config.get('session:resave'),
    saveUninitialized: config.get('session:saveUninitialized'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('middleware/sendHTTPError'));
app.use(require('middleware/loadUser'));

app.use(express.static('./public'));
require('routes')(app);

app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHTTPError(err);
    } else {
        log.error(err);
        err = new HttpError(500);
        res.sendHttpError(err);
    }
});

var server = http.createServer(app);
server.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});

var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
    socket.emit('connected', {welcome: 'hello, user'});
});
