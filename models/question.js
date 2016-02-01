var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema,
    random = require('mongoose-simple-random');

var schema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    },
    counter: {
        type: Number,
        required: true,
        default: 0
    }
});

schema.plugin(random);

schema.statics.getRandQuestion = function(theme, callback) {
    var Question = this;
    if (theme == '') {
        Question.findRandom({}, {}, {limit: 1}, function(err, result) {
            if (err) return callback(err);
            callback(err, result[0]);
        })
    } else {
        Question.findRandom({theme: theme}, {}, {limit: 1}, function(err, result) {
            if (err) return callback(err);
            if (result.length == 0) {
                Question.findRandom({}, {}, {limit: 1}, function(err, result) {
                    if (err) return callback(err);
                    callback(err, result[0]);
                })
            } else {
                callback(err, result[0]);
            }
        });
    }
};

exports.Question = mongoose.model('Question', schema);