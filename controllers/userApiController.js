import { sequelize } from '../models/index.js';
import models from '../models';
import * as entryDataValidation from '../utils/entryDataValidation.js';
import * as passwordHashing from '../utils/passwordHashing.js';
import * as fieldsValidation from '../utils/fieldsValidation.js';
import * as errorHandler from '../utils/errorHandler.js';
import { ORDER_STATUSES } from '../config/const.js';


export const createUser = async (request, response) => {
   
   const {email, password, name, phone} = request.body;

   const transaction = await sequelize.transaction();

   try {
      fieldsValidation.validateFields([email, password, name, phone]);

      if (!entryDataValidation.validateEmail(email)) {
         return response.status(400).send({message: 'Incorrect email'});
      }
   
      if (!entryDataValidation.validatePassword(password)) {
         return response.status(400).send({message: 'Incorrect password'});
      }
   
      const existingEmail = await models.User.findOne({where: {email}});
      if (existingEmail) return response.status(401).send({message: 'Email already exist'});

      const user = await models.User.create({
         email, 
         name, 
         phone, 
         passwordHash: await passwordHashing.hash(password)
      }, {transaction});

      await user.createBalance({}, {transaction});

      await transaction.commit();

      response.sendStatus(200);

   } catch (error) {
      transaction.rollback();
      errorHandler.handle(error, response);
   }
}


export const balance = async (request, response) => {

   const {userId, action} = request.body;
   const amountOfMoney = request.body.amountOfMoney;

   try {
      fieldsValidation.validateFields([userId, amountOfMoney, action]);

      const balance = await models.Balance.findByPk(userId);
      if (!balance) return response.status(404).send({message: 'Balance not found'});

      let resultedBalance;

      switch (action) {
         case 'replenishment':
            resultedBalance = parseFloat(balance.account) + amountOfMoney;
            break;
         case 'billing':
            resultedBalance = parseFloat(balance.account) - amountOfMoney;
            if (resultedBalance < 0) return response.status(403).send({message: 'Payment prohibited'});
            break;
         default:
            return response.status(400).send({message: 'Incorrect action'});
      }

      await balance.update({account: resultedBalance});

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

      const order = await user.getOrders({where: {status: ORDER_STATUSES.SHOPPING_CART}});

      if (order.length) {

         const orderProduct = await models.OrderProduct.findOne({
            where: {
               orderId: order[0].id,
               productId,
            }
         });
   
         if (orderProduct) {

            await orderProduct.update({quantity: orderProduct.quantity + productQuantity});

         }  else {

            await models.OrderProduct.create({
               quantity: productQuantity,
               orderId: order[0].id,
               productId, 
            }, {transaction});

         }
   
      } else {
         const order = await user.createOrder({status: ORDER_STATUSES.SHOPPING_CART}, {transaction});
         await models.OrderProduct.create({
            productId,
            orderId: order.id,
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

   const {userId, productId, orderId} = request.query;

   
   try {
      fieldsValidation.validateFields([userId, productId, orderId]);

      const product = await models.Product.findByPk(productId);
      if (!product) return response.status(404).send({message: 'Product does not exist'});

      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      const order = await user.getOrders({where: {id: orderId, status: ORDER_STATUSES.SHOPPING_CART}});
      if (!order.length) return response.status(404).send({message: 'Order does not exist'});

      const orderProduct = await models.OrderProduct.findOne({where: {orderId: order[0].id, productId}});
      if (!orderProduct) return response.status(404).send({message: 'Product does not exist in order'});

      await orderProduct.destroy();

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


export const removeOrder = async (request, response) => {

   const {userId, orderId} = request.query;
 
   try {
      fieldsValidation.validateFields([userId, orderId]);

      const order = await models.Order.findOne({where: {id: orderId, userId, status: ORDER_STATUSES.SHOPPING_CART}});
      if (!order) return response.status(404).send({message: 'Order does not exist'});

      await order.destroy();

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

   
}


export const completeOrder = async (request, response) => {

   const {userId, orderId} = request.body;

   const transaction = await sequelize.transaction();

   try {
      fieldsValidation.validateFields([userId, orderId]);

      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User not found'});

      const order = await user.getOrders({where: {id: orderId, status: ORDER_STATUSES.SHOPPING_CART}});
      if (!order.length) return response.status(404).send({message: 'Order not found'});

      const orderProducts = await order[0].getOrderProducts();
      if (!orderProducts.length) return response.status(404).send({message: 'No products in order'});

      let purchasePrice = 0;

      for (let i = 0; i < orderProducts.length; i++) {

         const product = await orderProducts[i].getProduct();

         if (!product) {
            return response.status(404).send({message: `Product ID ${orderProducts[i].productId} does not exist`});
         }
         purchasePrice += product.price * orderProducts[i].quantity;
      }

      const balance = await user.getBalance();

      if (balance.discount){

         const discount = balance.discount * 0.01 * purchasePrice;
         purchasePrice -= discount;
         
      }

      const resultedAccount = balance.account - purchasePrice;

      if (resultedAccount < 0) return response.status(403).send({message: 'Payment prohibited'});

      await balance.update({account: resultedAccount}, {transaction});
      await order[0].destroy({}, {transaction});

      await transaction.commit();
      return response.sendStatus(200);
   

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
         name: user.name,
         phone: user.phone,
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

   const {id, email, name, phone} = request.body;

   try {
      fieldsValidation.validateFields([id, email, name, phone]);

      if (!entryDataValidation.validateEmail(email)) {
         return response.status(400).send({message: 'Incorrect email'});
      }

      const user = await models.User.findByPk(id);
      if (!user) return response.status(404).send({message: 'User does not exist'});

      await user.update({email, name, phone});

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}


export const setDiscountForUser = async (request, response) => {

   const { userId, amountOfDiscount } = request.body;

   try {
      fieldsValidation.validateFields([userId, amountOfDiscount]);

      const user = await models.User.findByPk(userId);
      if (!user) return response.status(404).send({message: 'User not found'});

      const balance = await user.getBalance();
      await balance.update({discount: amountOfDiscount});

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}