const express = require('express');
const userApiRouter = express.Router();
const userApiController = require('../controllers/userApiController');


userApiRouter.post('/', userApiController.create)


module.exports = userApiRouter;