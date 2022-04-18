const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');

module.exports = sequelize.define('category', {
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
});