const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');

const OrderProduct =  sequelize.define('order_product', {
   user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   order_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
});

OrderProduct.removeAttribute('id');

module.exports = OrderProduct;