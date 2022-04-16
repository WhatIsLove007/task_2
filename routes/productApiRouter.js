const express = require('express');
const productApiRouter = express.Router();
const productApiController = require('../controllers/productApiController');


productApiRouter.post('/car', productApiController.addCar);

productApiRouter.delete('/car', productApiController.removeCar);


module.exports = productApiRouter;