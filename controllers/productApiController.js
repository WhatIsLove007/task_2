const Product = require('../models/Product');
const Category = require('../models/Category');
const fieldsValidation = require('../utils/fieldsValidation');

module.exports.add = async (request, response) => {

   const {name, description, categoryId} = request.body;
   const price = parseInt(request.body.price);

   try {
      fieldsValidation.validateFields([name, description, categoryId, price]);
   } catch (error) {    // ! not normal or normal ?
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const existingProduct = await Product.findOne({where: {name}});
      if (existingProduct) return response.status(409).send({message: 'Product already exists'});

      const existingCategory = await Category.findOne({where: {id: categoryId}});
      if (!existingCategory) return response.status(404).send({message: 'Category does not exist'});

      await Product.create({name, description, category_id: categoryId, price});

      response.sendStatus(200);
      
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}


module.exports.remove = async (request, response) => {

   const { id } = request.query;

   try {
      fieldsValidation.validateFields([id]);
   } catch (error) {    // ! not normal or ...?
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const existingProduct = await Product.destroy({where: {id}});
      if (!existingProduct) return response.status(404).send({message: 'Product does not exist'});
      response.sendStatus(200);
      
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}