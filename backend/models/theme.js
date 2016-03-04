var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema,
    random = require('mongoose-simple-random');

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    counter: {
        type: Number,
        default: 0
    }
});

schema.plugin(random);

schema.statics.getRandThemes = function(num, callback) {
    this.findRandom({}, {}, {limit: num}, function(err, result) {
        if (err) return callback(err);

        if (result.length == 0) {
            callback(null, ['все подряд'])
        } else {
            var themes = [];
            var length = result.length;

            for (var i = 0; i < length; i++) {
                themes.push(result[i].name);
            }

            callback(null, themes)
        }
    });
};

exports.Theme = mongoose.model('Theme', schema);