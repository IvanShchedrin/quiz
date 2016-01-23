var crypto = require('crypto');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var util = require('util');

var schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this.plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._plainPassword;
    });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({name: username}, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError(403, "Пароль неверен. Попробуйте другой"));
                }
            } else {
                callback(new AuthError(403, "Такого юзера не существует"));
                /*
                user = new User({name: username, password: password});
                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                })
                */
            }
        }
    ], callback);
};

exports.User = mongoose.model('User', schema);

function AuthError(code, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.code = code;
    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;