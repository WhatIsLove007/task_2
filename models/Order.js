import { Sequelize } from 'sequelize';
import sequelize from '../models/sequelize.js';
import OrderProduct from '../models/OrderProduct.js';

const Order = sequelize.define('order', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
});

Order.hasMany(OrderProduct, {onDelete: 'cascade'});
OrderProduct.belongsTo(Order, {onDelete: 'cascade'});

export default Order;