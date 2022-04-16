const User = require('../models/User')
const entryDataValidation = require('../models/business-logic/entryDataValidation');
const passwordHashing = require('../models/business-logic/passwordHashing');

module.exports.create = async (request, response) => {
   
   const {email, password} = request.body;

   if (!email || !password) return response.status(400).send({message: 'No data in request body'});

   if (!entryDataValidation.validateEmail(email)) {
      return response.status(400).send({message: 'Incorrect email'});
   }

   if (!entryDataValidation.validatePassword(password)) {
      return response.status(400).send({message: 'Incorrect password'});
   }

   try {
      const user = await User.findOne({where: {email}});
      if (user) return response.status(401).send({message: 'Email already exist'});

      await User.create({email, password: await passwordHashing.hash(password), account: 0});

      response.sendStatus(200);

   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }
}


module.exports.accountAdd = async (request, response) => {

   const email = request.body.email;
   const amountOfMoney = parseInt(request.body.amountOfMoney);

   if (!email || !amountOfMoney) {
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const user = await User.findOne({where: {email}});
      if (!user) return response.status(403).send({message: 'Email does not exist'});
      await User.update({account: user.account + amountOfMoney}, {where: {email}});
      response.sendStatus(200);
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}


module.exports.accountRemove = async (request, response) => {

   const email = request.body.email;
   const amountOfMoney = parseInt(request.body.amountOfMoney);

   if (!email || !amountOfMoney) {
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const user = await User.findOne({where: {email}});
      if (!user) return response.status(403).send({message: 'Email does not exist'});

      const resultedAccount = user.account - amountOfMoney;

      if (resultedAccount < 0) return response.status(403).send({message: 'Payment prohibited'})

      await User.update({account: resultedAccount}, {where: {email}});

      response.sendStatus(200);

   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}