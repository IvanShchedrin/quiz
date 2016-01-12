//var HttpError = require('error').HttpError;
//var User = require('models/user').User;
//var Question = require('models/question').Question;
//var ObjectID = require('mongodb').ObjectID;
var checkAuth = require('middleware/checkAuth');

module.exports = function(app) {

    app.get('/', require('./frontpage').get);
    app.post('/', require('./frontpage').post);

    app.post('/logout', require('./logout').post);

    app.get('/chat', checkAuth, require('./chat').get);

    app.get('/about', require('./about').get);

    app.get('/users', require('./users').get);


    /*
    app.get('/user/:id', function(req, res, next) {
        try{
            var id = new ObjectID(req.params.id);
        } catch (e) {
            return next(new HttpError(404, 'User not found. Invalid "id" parameter'))
        }

        User.findById(id, function(err, user) {
            if (err) return next(err);
            if (!user) {
                next(new HttpError(404, 'User not found'));
            } else {
                res.json(user);
            }
        });
    });

    app.get('/users', function(req, res, next) {
        User.find({}, function(err, users) {
            if (err) return next(err);
            res.json(users);
        })
    });


    app.get('/questions', function(req, res, next) {
        Question.find({}, function(err, question) {
            if (err) return next(err);
            res.json(question);
        })
    });


    */

};