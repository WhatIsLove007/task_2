'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('Subcategories', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {model: 'Categories'},
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.renameColumn('Products', 'categoryId', 'subcategoryId');

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('Subcategories');
    await queryInterface.renameColumn('Products', 'subcategoryId', 'categoryId');
    
  }

};