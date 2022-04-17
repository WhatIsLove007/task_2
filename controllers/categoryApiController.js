const Category = require('../models/Category');
const fieldsValidation = require('../models/business-logic/fieldsValidation')

module.exports.add = async (request, response) => {

   const name = request.body.name;

   try {
      fieldsValidation.validateFields([name]);
   } catch (error) {    // ! not normal
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const existingCategory = await Category.findOne({where: {name}});
      if (existingCategory) return response.status(409).send({message: 'Category already exists'});

      await Category.create({name});
      response.sendStatus(200);
      
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}


module.exports.remove = async (request, response) => {

   const id = request.body.id;

   try {
      fieldsValidation.validateFields([id]);
   } catch (error) {    // ! is it normal or i tak soydet ?
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const existingCategory = await Category.findOne({where: {id}});
      if (!existingCategory) return response.status(409).send({message: 'Category does not exist'});

      await Category.destroy({where: {id}});
      response.sendStatus(200);
      
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}