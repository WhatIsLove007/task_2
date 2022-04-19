const express = require('express');
const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();

// const sequelize = require('./models/OrderProduct');
const userApiRouter = require('./routes/userApiRouter');
const productApiRouter = require('./routes/productApiRouter');
const categoryApiRouter = require('./routes/categoryApiRouter');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({extended: false}));


app.use('/api/user', userApiRouter);

app.use('/api/product', productApiRouter);

app.use('/api/category', categoryApiRouter);




// sequelize.sync({force: true})
//    .then(() => {
//       app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`));
//    })
//    .catch(error => console.log(error))

app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`));
