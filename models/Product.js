import { Sequelize } from 'sequelize';
import sequelize from '../models/sequelize.js';
import OrderProduct from '../models/OrderProduct.js';

const Product = sequelize.define('product', {
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

Product.hasMany(OrderProduct, {onDelete: 'cascade'});
OrderProduct.belongsTo(Product, {onDelete: 'cascade'});

export default Product;