const express = require('express');
const userApiRouter = express.Router();
const userApiController = require('../controllers/userApiController');


userApiRouter.post('/', userApiController.createUser);

userApiRouter.get('/', userApiController.getUser);

userApiRouter.delete('/', userApiController.deleteUser);

userApiRouter.put('/', userApiController.updateUser);

userApiRouter.post('/account', userApiController.replenishmentOfMoneyOnAccount);

userApiRouter.delete('/account', userApiController.billingMoneyFromAccount);

userApiRouter.post('/order/product', userApiController.addProductToOrder);

userApiRouter.delete('/order/product', userApiController.removeProductFromOrder);

userApiRouter.delete('/order', userApiController.removeOrder);

userApiRouter.post('/order', userApiController.completeOrder);


module.exports = userApiRouter;