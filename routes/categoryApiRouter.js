const express = require('express');
const categoryApiRouter = express.Router();
const categoryApiController = require('../controllers/categoryApiController');


categoryApiRouter.post('/', categoryApiController.add);

categoryApiRouter.delete('/', categoryApiController.remove);

categoryApiRouter.get('/', categoryApiController.get);

categoryApiRouter.put('/', categoryApiController.update);

categoryApiRouter.get('/all', categoryApiController.getAll);

categoryApiRouter.get('/products', categoryApiController.getProductsInCategory);


module.exports = categoryApiRouter;