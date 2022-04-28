import models from '../models';
import * as fieldsValidation from '../utils/fieldsValidation.js';
import * as  errorHandler from '../utils/errorHandler.js';

export const add = async (request, response) => {

   const {name, description, categoryId} = request.body;
   const price = parseFloat(request.body.price);

   try {
      fieldsValidation.validateFields([name, description, categoryId, price]);

      const existingProduct = await models.Product.findOne({where: {name}});
      if (existingProduct) return response.status(409).send({message: 'Product already exists'});

      const category = await models.Category.findByPk(categoryId);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      await category.createProduct({name, description, price});

      response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const remove = async (request, response) => {

   const { id } = request.query;

   try {
      fieldsValidation.validateFields([id]);

      const existingProduct = await models.Product.destroy({where: {id}});
      if (!existingProduct) return response.status(404).send({message: 'Product does not exist'});
      
      return response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);

   }

}


export const get = async (request, response) => {

   const id = request.query.id;

   try {
      fieldsValidation.validateFields([id]);

      const product = await models.Product.findByPk(id);
      if (!product) return response.status(404).send({message: 'Product does not exist'});
      
      return response.send(product);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const getAll = async (request, response) => {
   
   try {
      const products = await models.Product.findAll({raw: true});
      if (!products.length) return response.status(404).send({message: 'No products'});

      return response.send(products);

   } catch (error) {
      errorHandler.handle(error, response);
      
   }

}