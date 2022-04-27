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
     passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
     },
     name: {
      type: DataTypes.STRING,
     },
     phone: {
      type: DataTypes.STRING,
     },
    }, {sequelize})
  }

  static associate(models) {
    this.hasMany(models.Order, {onDelete: 'cascade', foreignKey: 'userId'});
    this.hasOne(models.Balance, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};