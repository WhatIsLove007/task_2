const express = require('express');
const categoryApiRouter = express.Router();
const categoryApiController = require('../controllers/categoryApiController');


categoryApiRouter.post('/', categoryApiController.add);

categoryApiRouter.delete('/', categoryApiController.remove);

categoryApiRouter.get('/', categoryApiController.get);

categoryApiRouter.put('/', categoryApiController.update);

categoryApiRouter.get('/all', categoryApiController.getAll);


module.exports = categoryApiRouter;