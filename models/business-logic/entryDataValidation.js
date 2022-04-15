const validator = require('validator');


module.exports.validateEmail = email => {

   if (validator.isEmail(email)) return true

   return false

}

module.exports.validatePassword = (password, minLenght = 4, maxLength = 16) => {
   
   if (!validator.isLength(password, {min: minLenght, max: maxLength})) return false

   if (!validator.isAlphanumeric(password, 'en-US', {ignore: '_'})) return false

   return true

}