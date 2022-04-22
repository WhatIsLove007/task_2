import { Sequelize } from 'sequelize';
import sequelize from '../models/sequelize.js';
import Product from '../models/Product.js';

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

export default Category;