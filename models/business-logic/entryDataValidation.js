const validator = require('validator');

module.exports.validateEmail = email => validator.isEmail(email);

module.exports.validatePassword = password => /^[a-zA-Z0-9_]{4,16}$/.test(password);