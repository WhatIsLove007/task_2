import { sequelize } from '../models/index.js';
import models from '../models';
import * as entryDataValidation from '../utils/entryDataValidation.js';
import * as passwordHashing from '../utils/passwordHashing.js';
import * as fieldsValidation from '../utils/fieldsValidation.js';
import * as errorHandler from '../utils/errorHandler.js';


export const createUser = async (request, response) => {
   
   const {email, password} = request.body;

   try {
      fieldsValidation.validateFields([email, password]);

      if (!entryDataValidation.validateEmail(email)) {
         return response.status(400).send({message: 'Incorrect email'});
      }
   
      if (!entryDataValidation.validatePassword(password)) {
         return response.status(400).send({message: 'Incorrect password'});
      }
   
      const user = await models.User.findOne({where: {email}});
      if (user) return response.status(401).send({message: 'Email already exist'});

      await models.User.create({email, password: await passwordHashing.hash(password)});

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}


export const balance = async (request, response) => {

   const userId = request.body.userId;
   const amountOfMoney = parseFloat(request.body.amountOfMoney);
   const action = request.body.action;

   try {
      fieldsValidation.validateFields([userId, amountOfMoney, action]);

      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User not found'});


      if (action === 'replenishment') {
         const resultedBalance = parseFloat(user.account) + amountOfMoney;
         await user.update({account: resultedBalance});

      }  else if (action === 'billing') {
         const resultedBalance = user.account - amountOfMoney;
         if (resultedBalance < 0) return response.status(403).send({message: 'Payment prohibited'});

         await user.update({account: resultedBalance});

      }  else {
         return response.status(400).send({message: 'Incorrect action'});

      }


      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const addProductToOrder = async (request, response) => {

   const {userId, productId} = request.body;
   const productQuantity = parseInt(request.body.productQuantity);

   const transaction = await sequelize.transaction();

   try {
      fieldsValidation.validateFields([userId, productId, productQuantity]);         
      
      const product = await models.Product.findByPk(productId);
      if (!product) return response.status(404).send({message: 'Product does not exist'});
      
      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      const order = await user.getOrder();

      if (order) {

         const orderProduct = await models.OrderProduct.findOne({
            where: {
               orderId: order.id,
               productId,
            }
         });
   
         if (orderProduct) {

            await orderProduct.update({quantity: orderProduct.quantity + productQuantity});

         }  else {

            await order.createOrderProduct({  // ! repeated code
               userId: user.id,
               productId: productId,
               quantity: productQuantity,
            });
         }
   
      } else {
         const order = await user.createOrder({}, {transaction});
         await order.createOrderProduct({   // ! repeated code
            userId: user.id,
            productId: productId,
            quantity: productQuantity,
         }, {transaction});
      }
   
      await transaction.commit();
      return response.sendStatus(200);


   } catch (error) {
      await transaction.rollback();
      errorHandler.handle(error, response);
   }

}


export const removeProductFromOrder = async (request, response) => {

   const {userId, productId} = request.query;

   
   try {
      fieldsValidation.validateFields([userId, productId]);

      const product = await models.Product.findByPk(productId);
      if (!product) return response.status(404).send({message: 'Product does not exist'});

      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      const order = await user.getOrder();
      if (!order) return response.status(404).send({message: 'Order does not exist'});

      const orderProduct = await models.OrderProduct.findOne({where: {orderId: order.id, productId}});
      if (!orderProduct) return response.status(404).send({message: 'Product does not exist in order'});

      await orderProduct.destroy();

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const removeOrder = async (request, response) => {

   const userId = request.query.userId;
 
   try {
      fieldsValidation.validateFields([userId]);

      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      const order = await user.getOrder();
      if (!order) return response.status(404).send({message: 'Order does not exist'});

      await order.destroy();

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

   
}


export const completeOrder = async (request, response) => {

   const userId = request.body.userId;

   const transaction = await sequelize.transaction();

   try {
      fieldsValidation.validateFields([userId]);

      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User not found'});

      const order = await user.getOrder();
      if (!order) return response.status(404).send({message: 'Order not found'});
      
      const orderProducts = await order.getOrderProducts();
      if (!orderProducts.length) return response.status(404).send({message: 'No products in order'});

      let purchasePrice = 0;

      for (let i = 0; i < orderProducts.length; i++) {
         console.log(orderProducts);
         const product = await orderProducts[i].getProduct();
         console.log(product);

         if (!product) {
            return response.status(404).send({message: `Product ID ${orderProducts[i].productId} does not exist`});
         }
         purchasePrice += product.price * orderProducts[i].quantity;
      }

      const resultedAccount = user.account - purchasePrice;

      if (resultedAccount < 0) return response.status(403).send({message: 'Payment prohibited'});

      await user.update({account: resultedAccount}, {transaction});
      await models.Order.destroy({where: {userId: user.id}}, {transaction});

      await transaction.commit();
      response.sendStatus(200);
   

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const getUser = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const user = await models.User.findByPk(id);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      return response.send({
         id: user.id,
         email: user.email,
         account: user.account,
         createdAt: user.createdAt,
      });

   } catch (error) {
      errorHandler.handle(error, response);      
   }
}

export const deleteUser = async (request, response) => {

   const id = request.query.id;

   try {
      fieldsValidation.validateFields([id]);

      const user = await models.User.findByPk(id);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      await user.destroy();

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}

export const updateUser = async (request, response) => {

   const {id, newEmail} = request.body;

   try {
      fieldsValidation.validateFields([id, newEmail]);

      if (!entryDataValidation.validateEmail(newEmail)) {
         return response.status(400).send({message: 'Incorrect email'});
      }

      const user = await models.User.findByPk(id);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      await user.update({email: newEmail});

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}
