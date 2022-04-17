const express = require('express');
const productApiRouter = express.Router();
const productApiController = require('../controllers/productApiController');


productApiRouter.post('/', productApiController.add);

productApiRouter.delete('/', productApiController.remove);


module.exports = productApiRouter;