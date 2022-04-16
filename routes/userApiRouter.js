const express = require('express');
const userApiRouter = express.Router();
const userApiController = require('../controllers/userApiController');


userApiRouter.post('/', userApiController.create);

userApiRouter.post('/account/add', userApiController.accountAdd);

userApiRouter.post('/account/remove', userApiController.accountRemove);


module.exports = userApiRouter;