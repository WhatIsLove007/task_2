import { Model } from 'sequelize';

export default class Order extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      }
    }, {sequelize})
  }

  static associate(models) {
    // this.hasMany(models.OrderProduct, {onDelete: 'cascade', foreignKey: 'orderId'});
    this.belongsToMany(models.Product, {through: models.OrderProduct, foreignKey: 'orderId'});
    this.hasMany(models.OrderProduct, {onDelete: 'cascade', foreignKey: 'orderId'});
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};