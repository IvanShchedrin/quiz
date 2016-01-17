var cookie = require('cookie');
var config = require('config');
var cookieParser = require('cookie-parser');
var sessionStore = require('libs/sessionStore');
var HttpError = require('error').HttpError;
var User = require('models/user').User;

function loadUser(session, callback) {
    if (!session.user) {
        console.log('Session %s is anonymous', socket.id);
        return new HttpError(401, '401');
    }

    console.log('Retrieving user: ', session.user);

    User.findById(session.user, function(err, user) {
        if (err) return err;

        if (!user) {
            return new HttpError(401, '401');
        }

        callback(user);
    });
}

module.exports = function(server) {
    var io = require('socket.io')(server, {
        //origins: 'localhost:*'
    });

    io.use(function(socket, next) {

        socket.handshake.cookies = cookie.parse(socket.handshake.headers.cookie || '');
        var sidCookie = socket.handshake.cookies[config.get('session:key')];
        var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

        sessionStore.load(sid, function(err, session) {
            if (err) return next(new HttpError(500, 'Can`t load session. Error while trying find session' + sid));
            if (!session) return next(new HttpError(401, 'Can`t load session. Unknown sid ' + sid));

            socket.handshake.session = session;

            loadUser(session, function(user) {
                socket.handshake.user = user;
                console.log('auth complite');
                return next();
            });

            next(new HttpError(500, 'Database error. Can`t load session.user'))

        });
    });

    io.sockets.on('session:reload', function(sid) {
        console.log('Session:reload started');
        var clients = io.sockets.clients();

        clients.forEach(function(client) {
            if (client.handshake.session.id != sid) return;

            sessionStore.load(sid, function(err, session) {
                if (err) {
                    client.emit('error', 'server  error');
                    client.disconnect();
                    return;
                }
                if (!session) {
                    client.emit('logout');
                    client.disconnect();
                    return;
                }

                client.handshake.session = session;
            });
        });
    });

    io.sockets.on('connection', function(socket) {
        console.log('User connected');

        socket.emit('connected', 'User connected');

        socket.on('disconnect', function() {
            console.log('User disconnected');
        });

        socket.on('message', function(msg, callback) {
            socket.broadcast.emit('message', socket.handshake.user.name + ' > ' + msg);
            callback(socket.handshake.user.name + ' > ' + msg);
        });
    });

    return io;
};