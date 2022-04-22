import express from 'express';
import * as productApiController from '../controllers/productApiController.js';
export const productApiRouter = express.Router();


productApiRouter.post('/', productApiController.add);

productApiRouter.delete('/', productApiController.remove);

productApiRouter.get('/', productApiController.get);

productApiRouter.get('/all', productApiController.getAll);