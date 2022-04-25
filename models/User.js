import { Model } from 'sequelize';

export default class User extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
     },
     email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
     },
     password: {
        type: DataTypes.STRING,
        allowNull: false,
     },
     account: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
        defaultValue: 0,
      },
    }, {sequelize})
  }

  static associate(models) {
    this.hasOne(models.Order, {onDelete: 'cascade', foreignKey: 'userId'});
    this.hasMany(models.OrderProduct, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};