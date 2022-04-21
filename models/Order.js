const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');
const OrderProduct = require('../models/OrderProduct');

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

module.exports = Order;