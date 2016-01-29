var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;

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

schema.statics.getRandQuestion = function(callback) {
    this.count(function(err, count) {
        if (err) return callback(err);
        var rand = Math.floor(Math.random() * count);
        this.findOne().skip(rand).exec(callback);
    }.bind(this));
};

exports.Question = mongoose.model('Question', schema);