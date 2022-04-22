import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv/config';

import { sequelize } from './models/sequelize.js';
import { userApiRouter } from './routes/userApiRouter.js';
import { productApiRouter } from './routes/productApiRouter.js';
import { categoryApiRouter } from './routes/categoryApiRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({extended: false}));


app.use('/api/user', userApiRouter);

app.use('/api/product', productApiRouter);

app.use('/api/category', categoryApiRouter);




sequelize.sync()
   .then(() => {
      app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`));
   })
   .catch(error => console.log(error))

// app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`));
