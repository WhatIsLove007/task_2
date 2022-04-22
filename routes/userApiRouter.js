import express from 'express';
import * as userApiController from '../controllers/userApiController.js';
export const userApiRouter = express.Router();


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