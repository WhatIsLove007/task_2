const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');


const User = sequelize.define('user', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
   },                            // can use validate: {isEmail: true}
   password: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   account: {
      type: Sequelize.DECIMAL(11, 2),
      allowNull: false,
      defaultValue: 0,
   }
});

User.hasOne(Order, {onDelete: 'cascade'});

User.hasMany(OrderProduct);

module.exports = User;