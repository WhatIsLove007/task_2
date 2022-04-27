import { Model } from 'sequelize';

export default class Subcategory extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {model: 'Categories'},
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    }, {sequelize})
  }

  static associate(models) {
    this.hasMany(models.Product, {foreignKey: 'subcategoryId'});
    this.belongsTo(models.Category, {foreignKey: 'categoryId'})
  }
  
};