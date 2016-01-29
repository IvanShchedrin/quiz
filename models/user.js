var crypto = require('crypto');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var util = require('util');
var nodemailer = require('libs/nodemailer');

var schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    favTheme: {
        type: String
    },
    lastOnline: {
        type: Date
    },
    accStatus: {
        type: Number,
        required: true,
        default: 0
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
            }
        }
    ], callback);
};

schema.statics.createUser = function(data, callback) {
    var User = this;
    var confirmString = Math.random().toString(36).substring(2);

    User.findOne({name: data.login}, function(err, user) {
        if (err) return callback(err);

        if (user) {
            callback(new AuthError(403, 'Этот логин занят'));
        } else {
            var mailOptions = {
                from: 'John <quiz.vik.info@gmail.com>',
                to: data.email,
                subject: 'Подтверждение регистрации в викторине',
                html: '<p>Для подтверждения регистрации пройдите по <a href="http://localhost:3000/registry?reg=' + confirmString + '">ссылке</a>.</p>'
            };

            nodemailer.sendMail(mailOptions, function(err, info){
                if(err){
                    console.log(err);
                    return callback(new AuthError(403, 'Неправильный формат почтового адреса'));
                }

                var user = new User({name: data.login, password: data.password, email: data.email + '_|_' + confirmString});
                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                });
            });
        }
    })
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