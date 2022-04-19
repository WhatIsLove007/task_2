const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');

const OrderProduct =  sequelize.define('orderProduct', {
   quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
});

OrderProduct.removeAttribute('id');

module.exports = OrderProduct;