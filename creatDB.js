var mongoose = require('libs/mongoose');
var async = require('async');
var log = require('libs/log')(module);

async.series([
    openConnection,
    dropDatabase,
    //dropQuestions,
    requireModels,
    createUsers,
    createQuestions
], function(err) {
    if (err) log.error(err);
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

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

// *************************** Model`s methods. Model data addition ***************************

function createUsers(callback) {
    var users = [
        {name: 'admin', password: 'difpass'},
        {name: 'user1', password: 'password1'},
        {name: 'user2', password: 'password2'}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createQuestions(callback) {
    var questions = [
        {question: 'Явление, обстоятельство, служащее основанием или обусловливающее другое явление.', answer: 'причина'},
        {question: 'Автоматическое скорострельное оружие малого калибра.', answer: 'пулемет'},
        {question: 'Лицо, награжденное орденом.', answer: 'кавалер'},
        {question: 'Небольшая дверь в заборе, воротах, ограде.', answer: 'калитка'},
        {question: 'Раздел анатомии, изучающий строение мышц, мышечной системы.', answer: 'миология'},
        {question: 'Детеныш моржа.', answer: 'моржонок'}
    ];

    async.each(questions, function(questionData, callback) {
        var question = new mongoose.models.Question(questionData);
        question.save(callback);
    }, callback);
}

function dropQuestions(callback) {
    var db = mongoose.connection.db;
    db.collection('questions').drop(callback);
}