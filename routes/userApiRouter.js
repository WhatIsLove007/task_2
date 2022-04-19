const express = require('express');
const userApiRouter = express.Router();
const userApiController = require('../controllers/userApiController');


userApiRouter.post('/', userApiController.createUser);

userApiRouter.get('/', userApiController.getUser);

userApiRouter.delete('/', userApiController.deleteUser);

userApiRouter.put('/', userApiController.updateUser);

userApiRouter.post('/account', userApiController.addMoneyToAccount);

userApiRouter.delete('/account', userApiController.removeMoneyFromAccount);

userApiRouter.post('/order/product', userApiController.addProductToOrder);

userApiRouter.delete('/order/product', userApiController.removeProductFromOrder);

userApiRouter.delete('/order', userApiController.removeOrder);

userApiRouter.post('/order', userApiController.completeOrder);


module.exports = userApiRouter;