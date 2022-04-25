import { Model } from 'sequelize';

export default class OrderProduct extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({  // there is must be no id
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Orders'},
        onDelete: 'cascade',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'Products'},
        onDelete: 'cascade',
      },
    }, {sequelize})
  }

  static associate(models) {
    this.belongsTo(models.Order, {onDelete: 'cascade', foreignKey: 'orderId'});
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
    this.belongsTo(models.Product, {onDelete: 'cascade', foreignKey: 'productId'});
  }
  
};