const User = require('../models/User');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Product = require('../models/Product');
const entryDataValidation = require('../utils/entryDataValidation');
const passwordHashing = require('../utils/passwordHashing');
const fieldsValidation = require('../utils/fieldsValidation')


module.exports.create = async (request, response) => {
   
   const {email, password} = request.body;

   try {
      fieldsValidation.validateFields([email, password]);
   } catch (error) {    // ! not normal
      return response.status(400).send({message: 'No data in request body'});
   }

   if (!entryDataValidation.validateEmail(email)) {
      return response.status(400).send({message: 'Incorrect email'});
   }

   if (!entryDataValidation.validatePassword(password)) {
      return response.status(400).send({message: 'Incorrect password'});
   }

   try {
      const user = await User.findOne({where: {email}});
      if (user) return response.status(401).send({message: 'Email already exist'});

      await User.create({email, password: await passwordHashing.hash(password)});

      response.sendStatus(200);

   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }
}


module.exports.addAccount = async (request, response) => {

   const email = request.body.email;
   const amountOfMoney = parseFloat(request.body.amountOfMoney);

   try {
      fieldsValidation.validateFields([email, amountOfMoney]);
   } catch (error) {    // ! not normal
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const user = await User.findOne({where: {email}});
      if (!user) return response.status(403).send({message: 'Email does not exist'});
      await User.update({account: user.account + amountOfMoney}, {where: {email}});
      response.sendStatus(200);
   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}


module.exports.removeAccount = async (request, response) => {

   const email = request.body.email;
   const amountOfMoney = parseFloat(request.body.amountOfMoney);

   try {
      fieldsValidation.validateFields([email, amountOfMoney]);
   } catch (error) {    // ! not normal
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      const user = await User.findOne({where: {email}});
      if (!user) return response.status(403).send({message: 'Email does not exist'});

      const resultedAccount = user.account - amountOfMoney;

      if (resultedAccount < 0) return response.status(403).send({message: 'Payment prohibited'})

      await User.update({account: resultedAccount}, {where: {email}});

      response.sendStatus(200);

   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}


module.exports.addProductToOrder = async (request, response) => {

   const {userEmail, productId} = request.body;
   const productQuantity = parseInt(request.body.productQuantity);

   try {
      fieldsValidation.validateFields([userEmail, productId, productQuantity]);
   } catch (error) {    // ! not normal
      return response.status(400).send({message: 'No data in request body'});
   }

   try {
      
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
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }

}


module.exports.removeProductFromOrder = async (request, response) => {

   const {userId, productId} = request.query;

   try {
      fieldsValidation.validateFields([userId, productId]);
   } catch (error) {
      return response.status(400).send({message: 'No data in request body'});
   }
   
   try {

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
      console.log(error);
      response.status(500).send({message: 'Server error'});

   }

}


module.exports.removeOrder = async (request, response) => {

   const userId = request.query.userId;

   try {
      fieldsValidation.validateFields([userId]);
   } catch (error) {
      return response.status(400).send({message: 'No data in request body'});
   }
 
   try {

      const user = await User.findOne({where: {id: userId}});
      if (!user) return response.status(401).send({message: 'User does not exist'});

      const order = await Order.findOne({where: {user_id: user.id}});
      if (!order) return response.status(404).send({message: 'Order does not exist'});

      await OrderProduct.destroy({where: {order_id: order.id}});

      await Order.destroy({where: {user_id: user.id}});

      response.sendStatus(200);

   } catch (error) {
      console.log(error);
      response.status(500).send({message: 'Server error'});

   }

   
}


module.exports.completeOrder = async (request, response) => {

   const userId = request.body.userId;

   try {
      fieldsValidation.validateFields([userId]);
   } catch (error) {
      return response.status(400).send({message: 'No data in request body'});
   }

   try {

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
      console.log(error);
      response.status(500).send({message: 'Server error'});
   }


}