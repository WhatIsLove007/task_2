const express = require('express');
const categoryApiRouter = express.Router();
const categoryApiController = require('../controllers/categoryApiController');


categoryApiRouter.post('/', categoryApiController.add);

categoryApiRouter.delete('/', categoryApiController.remove);


module.exports = categoryApiRouter;