import { Model } from 'sequelize';

export default class Category extends Model {
  
  static init = (sequelize, DataTypes) => {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        references: {model: 'Categories'},
      }
    }, {sequelize})
  }

  static associate(models) {
    this.hasMany(models.Subcategory, {foreignKey: 'categoryId'});
  }
  
};