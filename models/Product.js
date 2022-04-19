const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');

module.exports = sequelize.define('product', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
   },
   description: {
      type: Sequelize.TEXT,
      allowNull: false,
   },
   price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
   },
});