var config = require('config');
var nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport(config.get('nodemailer:smtp'));