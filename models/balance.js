import { Model } from 'sequelize';

export default class Balance extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      account: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    }, {sequelize})
  }

  static associate(models) {
    this.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
  }
  
};