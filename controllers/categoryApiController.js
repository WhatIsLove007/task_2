import models from '../models';
import * as fieldsValidation from '../utils/fieldsValidation.js';
import * as errorHandler from '../utils/errorHandler.js';

export const add = async (request, response) => {

   const name = request.body.name;

   try {

      fieldsValidation.validateFields([name]);

      const existingCategory = await models.Category.findOne({where: {name}});
      if (existingCategory) return response.status(409).send({message: 'Category already exists'});

      await models.Category.create({name});
      response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const remove = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const category = await models.Category.findByPk(id);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      await category.destroy();
      response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const get = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const category = await models.Category.findByPk(id);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      return response.send(category);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const update = async (request, response) => {

   const {id, newName} = request.body;

   try {

      fieldsValidation.validateFields([id, newName]);

      const category = await models.Category.findByPk(id);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      await category.update({name: newName});

      return response.status(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const getAll = async (request, response) => {
   try {
      const categories = await models.Category.findAll();
      if (!categories.length) return response.status(404).send({message: 'No categories'});

      response.send(categories);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}


export const getProductsInCategory = async (request, response) => {
   
   const categoryId = request.query.categoryId;

   try {
      fieldsValidation.validateFields([categoryId]);

      const category = await models.Category.findByPk(categoryId);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      const products = await category.getProducts();
      if (!products.length) return response.status(404).send({message: 'No products in category'});
      
      response.send(products);


   } catch (error) {
      errorHandler.handle(error, response);
   }

}
