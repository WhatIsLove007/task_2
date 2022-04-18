const Category = require('../models/Category');
const fieldsValidation = require('../utils/fieldsValidation');
const errorHandler = require('../utils/errorHandler');

module.exports.add = async (request, response) => {

   const name = request.body.name;

   try {

      fieldsValidation.validateFields([name]);

      const existingCategory = await Category.findOne({where: {name}});
      if (existingCategory) return response.status(409).send({message: 'Category already exists'});

      await Category.create({name});
      response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.remove = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const existingCategory = await Category.findOne({where: {id}});
      if (!existingCategory) return response.status(404).send({message: 'Category does not exist'});

      await Category.destroy({where: {id}});
      response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.get = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const category = await Category.findOne({where: {id}});
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      return response.status(200).send(category);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.update = async (request, response) => {

   const {id, newName} = request.body;

   try {

      fieldsValidation.validateFields([id, newName]);

      const category = await Category.findOne({where: {id}});
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      await Category.update({name: newName}, {where: {id}});

      return response.status(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}