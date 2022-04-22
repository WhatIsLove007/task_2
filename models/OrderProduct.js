import { Sequelize } from 'sequelize';
import sequelize from '../models/sequelize.js';

const OrderProduct = sequelize.define('orderProduct', {
   quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
});

OrderProduct.removeAttribute('id');

export default OrderProduct;