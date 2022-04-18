const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');

module.exports = sequelize.define('order', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
   },
})