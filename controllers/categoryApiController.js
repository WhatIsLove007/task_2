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

      const category = await Category.findByPk(id);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      await category.destroy();
      response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.get = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const category = await Category.findByPk(id);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      return response.send(category);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.update = async (request, response) => {

   const {id, newName} = request.body;

   try {

      fieldsValidation.validateFields([id, newName]);

      const category = await Category.findByPk(id);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      await category.update({name: newName});

      return response.status(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.getAll = async (request, response) => {
   try {
      const categories = await Category.findAll();
      if (!categories.length) return response.status(404).send({message: 'No categories'});

      response.send(categories);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}


module.exports.getProductsInCategory = async (request, response) => {
   
   const categoryId = request.query.categoryId;

   try {
      fieldsValidation.validateFields([categoryId]);

      const category = await Category.findByPk(categoryId);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      const products = await category.getProducts();
      if (!products.length) return response.status(404).send({message: 'No products in category'});
      
      response.send(products);


   } catch (error) {
      errorHandler.handle(error, response);
   }

}
