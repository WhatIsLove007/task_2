const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');

module.exports = sequelize.define('user', {
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
