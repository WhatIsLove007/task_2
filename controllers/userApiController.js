const User = require('../models/User');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Product = require('../models/Product');
const entryDataValidation = require('../utils/entryDataValidation');
const passwordHashing = require('../utils/passwordHashing');
const fieldsValidation = require('../utils/fieldsValidation');
const errorHandler = require('../utils/errorHandler');


module.exports.createUser = async (request, response) => {
   
   const {email, password} = request.body;

   try {
      fieldsValidation.validateFields([email, password]);

      if (!entryDataValidation.validateEmail(email)) {
         return response.status(400).send({message: 'Incorrect email'});
      }
   
      if (!entryDataValidation.validatePassword(password)) {
         return response.status(400).send({message: 'Incorrect password'});
      }
   
      const user = await User.findOne({where: {email}});
      if (user) return response.status(401).send({message: 'Email already exist'});

      await User.create({email, password: await passwordHashing.hash(password)});

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}


module.exports.addAccount = async (request, response) => {

   const email = request.body.email;
   const amountOfMoney = parseFloat(request.body.amountOfMoney);

   try {
      fieldsValidation.validateFields([email, amountOfMoney]);

      const user = await User.findOne({where: {email}});
      if (!user) return response.status(403).send({message: 'Email does not exist'});
      await User.update({account: user.account + amountOfMoney}, {where: {email}});
      response.sendStatus(200);
   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.removeAccount = async (request, response) => {

   const email = request.body.email;
   const amountOfMoney = parseFloat(request.body.amountOfMoney);

   try {
      fieldsValidation.validateFields([email, amountOfMoney]);

      const user = await User.findOne({where: {email}});
      if (!user) return response.status(403).send({message: 'Email does not exist'});

      const resultedAccount = user.account - amountOfMoney;

      if (resultedAccount < 0) return response.status(403).send({message: 'Payment prohibited'})

      await User.update({account: resultedAccount}, {where: {email}});

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.addProductToOrder = async (request, response) => {

   const {userEmail, productId} = request.body;
   const productQuantity = parseInt(request.body.productQuantity);


   try {
      fieldsValidation.validateFields([userEmail, productId, productQuantity]);
      
      const product = await Product.findOne({where: {id: productId}});
      if (!product) return response.status(404).send({message: 'Product does not exist'});
      
      const user = await User.findOne({where: {email: userEmail}});
      if (!user) return response.status(404).send({message: 'User does not exist'});

      const order = await Order.findOne({where: {user_id: user.id}});
      
      if (order) {

         const orderProduct = await OrderProduct.findOne({
            where: {
               order_id: order.id,
               product_id: productId,
            }
         });

         if (orderProduct) {

            await OrderProduct.update({quantity: orderProduct.quantity + productQuantity}, 
               {where: {order_id: order.id}});

         }  else {

            await OrderProduct.create({  // ! repeated code
               user_id: user.id,
               order_id: order.id,
               product_id: productId,
               quantity: productQuantity,
            });

         }

      } else {

         const order = await Order.create({user_id: user.id});

         await OrderProduct.create({   // ! repeated code
            user_id: user.id,
            order_id: order.id,
            product_id: productId,
            quantity: productQuantity,
         });
      }

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);

   }

}


module.exports.removeProductFromOrder = async (request, response) => {

   const {userId, productId} = request.query;

   
   try {
      fieldsValidation.validateFields([userId, productId]);

      const product = await Product.findOne({where: {id: productId}});
      if (!product) return response.status(404).send({message: 'Product does not exist'});

      const user = await User.findOne({where: {id: userId}});
      if (!user) return response.status(404).send({message: 'User does not exist'});

      const order = await Order.findOne({where: {user_id: user.id}});
      if (!order) return response.status(404).send({message: 'Order does not exist'});

      const orderProduct = await OrderProduct.findOne({where: {order_id: order.id, product_id: productId}});
      if (!orderProduct) return response.status(404).send({message: 'Product does not exist in order'});

      await OrderProduct.destroy({where: {order_id: order.id, product_id: productId}});

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.removeOrder = async (request, response) => {

   const userId = request.query.userId;
 
   try {
      fieldsValidation.validateFields([userId]);

      const user = await User.findOne({where: {id: userId}});
      if (!user) return response.status(401).send({message: 'User does not exist'});

      const order = await Order.findOne({where: {user_id: user.id}});
      if (!order) return response.status(404).send({message: 'Order does not exist'});

      await OrderProduct.destroy({where: {order_id: order.id}});

      await Order.destroy({where: {user_id: user.id}});

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

   
}


module.exports.completeOrder = async (request, response) => {

   const userId = request.body.userId;

   try {
      fieldsValidation.validateFields([userId]);

      const user = await User.findOne({where: {id: userId}});
      if (!user) return response.status(401).send({message: 'User does not exist'});

      const order = await Order.findOne({where: {user_id: user.id}});
      if (!order) return response.status(404).send({message: 'Order does not exist'});
      
      const orderProducts = await OrderProduct.findAll({where: {order_id: order.id}});
      if (orderProducts[0] === undefined) return response.status(404).send({message: 'No products in order'});

      let purchasePrice = 0;

      for (let i = 0; i < orderProducts.length; i++) {

         const product = await Product.findOne({where: {id: orderProducts[i].product_id}});
         if (!product) {
            return response.status(404).send({message: `Product ID ${orderProducts[i].product_id} does not exist`});
         }
         console.log(product.price, orderProducts[i].quantity);
         purchasePrice += product.price * orderProducts[i].quantity;
      }

      const resultedAccount = user.account - purchasePrice;
      if (resultedAccount < 0) return response.status(403).send({message: 'Payment prohibited'});

      await User.update({account: resultedAccount}, {where: {id: user.id}});
      await OrderProduct.destroy({where: {order_id: order.id}});
      await Order.destroy({where: {user_id: user.id}});

      response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }

}


module.exports.getUser = async (request, response) => {

   const id = request.query.id;

   try {

      fieldsValidation.validateFields([id]);

      const user = await User.findOne({where: {id}});
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

module.exports.deleteUser = async (request, response) => {

   const id = request.query.id;

   try {
      fieldsValidation.validateFields([id]);

      const user = await User.findOne({where: {id}});
      if (!user) return response.status(404).send({message: 'User does not exist'});

      await User.destroy({where: {id}});

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}

module.exports.updateUser = async (request, response) => {

   const {id, newEmail} = request.body;

   try {
      fieldsValidation.validateFields([id, newEmail]);

      if (!entryDataValidation.validateEmail(newEmail)) {
         return response.status(400).send({message: 'Incorrect email'});
      }

      const user = await User.findOne({where: {id}});
      if (!user) return response.status(404).send({message: 'User does not exist'});

      await User.update({email: newEmail}, {where: {id}});

      return response.sendStatus(200);

   } catch (error) {
      errorHandler.handle(error, response);
   }
}
