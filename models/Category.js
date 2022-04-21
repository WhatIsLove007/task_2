const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../models/sequelize');
const Product = require('../models/Product');

const Category = sequelize.define('category', {
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

Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = Category;