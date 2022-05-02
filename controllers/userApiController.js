import { Op } from 'sequelize';
import { sequelize } from '../models/index.js';
import models from '../models';
import * as entryDataValidation from '../utils/entryDataValidation.js';
import * as passwordHashing from '../utils/passwordHashing.js';
import * as fieldsValidation from '../utils/fieldsValidation.js';
import * as errorHandler from '../utils/errorHandler.js';
import * as currencyConverter from '../utils/currencyConverter.js';
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

   const { userId, currency, action } = request.body;
   let amountOfMoney = request.body.amountOfMoney;

   try {

      fieldsValidation.validateFields([userId, amountOfMoney, amountOfMoney, action]);

      if (currency !== 'USD'){
         amountOfMoney = await currencyConverter.convertToUsd(currency, amountOfMoney);
      }

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
      
      const user = await models.User.findByPk(userId, {
         include: {
            model: models.Order,
            where: {status: ORDER_STATUSES.SHOPPING_CART},
            required: false,
            include: {
               model: models.OrderProduct,
               required: false,
               where: {productId}
            }
         }
      });

      if (!user) return response.status(404).send({message: 'User does not exist'});

      if (!user.Orders.length) {
         const order = await user.createOrder({status: ORDER_STATUSES.SHOPPING_CART}, {transaction});
         await order.createOrderProduct({
            productId,
            quantity: productQuantity,
         }, {transaction});

      }  else {

         if (user.Orders[0].OrderProducts[0]) {
            await user.Orders[0].OrderProducts[0].update({
               quantity: user.Orders[0].OrderProducts[0].quantity + productQuantity,
            });

         }  else {
            await user.Orders[0].createOrderProduct({
               quantity: productQuantity,
               productId, 
            }, {transaction});
            
         }
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

      const user = await models.User.findByPk(userId, {
         include: {
            model: models.Order,
            where: {id: orderId},
            required: false,
            include: {
               model: models.OrderProduct, 
               where: {productId}, 
               required: false,
            },
         },
         attributes: ['id', 'email', 'name', 'phone'],
      });

      if (!user) return response.status(404).send({message: 'User does not exist'});
      if (!user.Orders.length) return response.status(404).send({message: 'Order does not exist'});
      if (!user.Orders[0].OrderProducts[0]) {
         return response.status(404).send({message: 'Product does not exist in order'});
      }

      await user.Orders[0].OrderProducts[0].destroy();

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

      const user = await models.User.findByPk(userId, {
         include: {
            model: models.Order,
            where: {id: orderId, status: ORDER_STATUSES.SHOPPING_CART},
            required: false,
            include: {
               model: models.OrderProduct,
               required: false,
            },
         }
      });

      if (!user) return response.status(404).send({message: 'User not found'});

      if (!user.Orders.length) return response.status(404).send({message: 'Order not found'});

      if (!user.Orders[0].OrderProducts.length) return response.status(404).send({message: 'No products in order'});

      let purchasePrice = 0;

      for (let i = 0; i < user.Orders[0].OrderProducts.length; i++) {

         const product = await user.Orders[0].OrderProducts[i].getProduct();

         if (!product) {
            return response.status(404).send({
               message: `Product ID ${user.Orders[0].OrderProducts[i].productId} does not exist`
            });
         }
         purchasePrice += product.price * user.Orders[0].OrderProducts[i].quantity;
      }

      const balance = await user.getBalance();

      if (balance.discount){

         const discount = balance.discount * 0.01 * purchasePrice;
         purchasePrice -= discount;
         
      }

      const resultedAccount = balance.account - purchasePrice;

      if (resultedAccount < 0) return response.status(403).send({message: 'Payment prohibited'});

      await balance.update({account: resultedAccount}, {transaction});
      await user.Orders[0].update({status: ORDER_STATUSES.PAID, orderPrice: purchasePrice}, {transaction});

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


export const getUsers = async (request, response) => {

   const {email, name, status, orderPriceIsMoreThan, balance, discount} = request.query;

   try {

      const users = await models.User.findAll({
         where: {
            [Op.and]: [
               {email: {[Op.like]: `%${email}%`}},
               {name: {[Op.like]: `%${name}%`}},
            ],
         },
         include: [{
            model: models.Balance,
            attributes: ['userId', 'account', 'discount'],
            where: {
               [Op.and]: [
                  {account: {[Op.gte]: balance[0]}},
                  {account: {[Op.lte]: balance[1]}},
                  {discount: {[Op.gte]: discount[0]}},
                  {discount: {[Op.lte]: discount[1]}},
               ]
            }
         }, {
            model: models.Order,
            ...(status? {required: true, where: {status}} : {}),
            ...(orderPriceIsMoreThan? {
               required: true,
               where: {
                  orderPrice: {
                     [Op.gte]: orderPriceIsMoreThan,
                  }
               }
            } : {})
         }],
      });

      if (!users.length) return response.status(404).send({message: 'Users not found'});

      return response.send(users);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}