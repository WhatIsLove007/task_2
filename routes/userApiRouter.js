const express = require('express');
const userApiRouter = express.Router();
const userApiController = require('../controllers/userApiController');


userApiRouter.post('/', userApiController.create);

userApiRouter.post('/account', userApiController.addAccount);

userApiRouter.delete('/account', userApiController.removeAccount);

userApiRouter.post('/order/product', userApiController.addProductToOrder);

userApiRouter.delete('/order/product', userApiController.removeProductFromOrder);

userApiRouter.delete('/order', userApiController.removeOrder);

userApiRouter.post('/order', userApiController.completeOrder);


module.exports = userApiRouter;