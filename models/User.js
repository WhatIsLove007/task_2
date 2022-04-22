import { Sequelize } from 'sequelize';
import sequelize from '../models/sequelize.js';
import Order from '../models/Order.js';
import OrderProduct from '../models/OrderProduct.js';


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
   },
});

User.hasOne(Order, {onDelete: 'cascade'});
Order.belongsTo(User);

User.hasMany(OrderProduct);
OrderProduct.belongsTo(User);

export default User;