const User = require('../models/User')
const entryDataValidation = require('../models/business-logic/entryDataValidation');
const passwordHashing = require('../models/business-logic/passwordHashing');

module.exports.create = (request, response) => {
   
   const email = request.body.email;
   const password = request.body.password;

   if (!email || !password) return response.status(400).send({message: 'No data in request body'});

   if (!entryDataValidation.validateEmail(email)) {
      return response.status(400).send({message: 'Incorrect email'});
   }

   if (!entryDataValidation.validatePassword(password)) {
      return response.status(400).send({message: 'Incorrect password'});
   }

   User.findOne({where: {email: email}})
      .then(result => {
         if (result) {
            response.status(401).send({message: 'Email already exist'})
            throw null;
         }
         return passwordHashing.hash(password)
      })
      .then(hashedPassword => {
         return User.create({email: email, password: hashedPassword})
      })
      .then(() => {
         response.sendStatus(200);
      })
      .catch(error => {
         if (error) {
            console.log(error);
            response.status(500).send({message: 'Server error'});
         }
      })
}