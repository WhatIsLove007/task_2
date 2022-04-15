const express = require('express');
const Sequelize = require('sequelize');
const dotenv = require('dotenv').config()

const sequelize = require('./models/User');
const userApiRouter = require('./routes/userApiRouter');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({extended: false}));


app.use('/api/user', userApiRouter);




sequelize.sync()
   .then(result => {
      app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`));
   })
   .catch(error => console.log(error))