import express from 'express';
import dotenv from 'dotenv/config';

import models from './models';
import { userApiRouter } from './routes/userApiRouter.js';
import { productApiRouter } from './routes/productApiRouter.js';
import { categoryApiRouter } from './routes/categoryApiRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use('/api/user', userApiRouter);

app.use('/api/product', productApiRouter);

app.use('/api/category', categoryApiRouter);




// models.OrderProduct.sync()
//    .then(() => {
//       app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`));
//    })
//    .catch(error => console.log(error))

app.listen(PORT, () => console.log(`Server has been started on PORT ${PORT}...`));