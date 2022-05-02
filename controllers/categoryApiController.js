import { Op } from 'sequelize';
import models from '../models';
import * as fieldsValidation from '../utils/fieldsValidation.js';
import * as errorHandler from '../utils/errorHandler.js';


export const add = async (request, response) => {

   const { name, parentId } = request.body;

   try {

      fieldsValidation.validateFields([name, parentId]);

      const existingCategory = await models.Category.findOne({where: {name}});
      if (existingCategory) return response.status(409).send({message: 'Category already exists'});

      if (parentId) {
         const parentCategory = await models.Category.findOne({where: {id: parentId}});
         if (!parentCategory) return response.status(404).send({message: 'Parent category not found'});
      }
      
      await models.Category.create({ name, ...(parentId && {parentId}) });
      
      return response.sendStatus(200);
      
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
      return response.sendStatus(200);
      
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const get = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const category = await models.Category.findOne({where: {id}, include: [
         {model: models.Category},
         {model: models.Product}, 
      ]});

      if (!category) return response.status(404).send({message: 'Category does not exist'});


      return response.send(category);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const update = async (request, response) => {

   const {id, name, parentId} = request.body;

   try {

      fieldsValidation.validateFields([id, name, parentId]);

      const category = await models.Category.findByPk(id);
      if (!category) return response.status(404).send({message: 'Category does not exist'});

      const parentCategory = await models.Category.findByPk(parentId);
      if (!parentCategory) return response.status(404).send({message: 'Parent category does not exist'});

      await category.update({name, parentId});

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const getAll = async (request, response) => {

   const name = request.query.name;
   const limit = parseInt(request.query.limit);
   const offset = parseInt(request.query.offset);

   try {
      fieldsValidation.validateFields([limit, offset]);

      const categories = await models.Category.findAll({
         include: models.Category, 
         where: {
            name: {[Op.like]: `%${name}%`},
         },
         limit, 
         offset,
      });
      
      if (!categories.length) return response.status(404).send({message: 'No categories'});

      return response.send(categories);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}
