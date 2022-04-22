import express from 'express';
import * as categoryApiController from '../controllers/categoryApiController.js';
export const categoryApiRouter = express.Router();


categoryApiRouter.post('/', categoryApiController.add);

categoryApiRouter.delete('/', categoryApiController.remove);

categoryApiRouter.get('/', categoryApiController.get);

categoryApiRouter.put('/', categoryApiController.update);

categoryApiRouter.get('/all', categoryApiController.getAll);

categoryApiRouter.get('/products', categoryApiController.getProductsInCategory);