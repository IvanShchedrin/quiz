var mongoose = require('libs/mongoose');
var async = require('async');
var fs = require('fs');

async.series([
    openConnection,
    //dropDatabase,
    //dropQuestions,
    requireModels,
    //createUsers,
    //createQuestions,
    createThemes
], function(err) {
    if (err) console.log(err);
    mongoose.disconnect();
});

// **************************** Common methods. Working with database ****************************

// Connecting to database.
// Makes mongoose connection to database.
function openConnection(callback) {
    mongoose.connection.on('open', callback);
}

// Drop database.
// Erases all collections and database
function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

// Require models
// Requires all models that are located in 'models/*.js
function requireModels(callback) {
    require('models/user');
    require('models/question');
    require('models/theme');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

// *************************** Model`s methods. Model data addition ***************************

function createUsers(callback) {
    var users = [
        {name: 'admin', password: 'difpass', email: 'oktava6@mail.ru'},
        {name: 'user1', password: 'password1', email: 'oktava6@mail.ru'},
        {name: 'user2', password: 'password2', email: 'oktava6@mail.ru'}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createQuestions(callback) {
    var result = fs.readFileSync('questions.txt', 'utf8').split('\r\n');

    var questions = [];

    for (var i = 0; i < result.length; i++) {
        var obj = {
            question: '',
            answer: '',
            theme: 'все подряд'
        };
        obj.question = result[i].split('|')[0];
        obj.answer = result[i].split('|')[1];

        questions.push(obj);
    }

    async.each(questions, function(questionData, callback) {
        var question = new mongoose.models.Question(questionData);
        question.save(callback);
    }, callback);

    console.log('finished');

}

function createThemes(callback) {
    var themes = [
        {name: 'история'},
        {name: 'природа'},
        {name: 'география'},
        {name: 'музыка'},
        {name: 'личности'},
        {name: 'кино'},
        {name: 'спорт'},
        {name: 'человек'},
        {name: 'животные'},
        {name: 'физика'}
    ];

    async.each(themes, function(themeData, callback) {
        var theme = new mongoose.models.Theme(themeData);
        theme.save(callback);
    }, callback);
}

function dropQuestions(callback) {
    var db = mongoose.connection.db;
    db.collection('questions').drop(callback);
}