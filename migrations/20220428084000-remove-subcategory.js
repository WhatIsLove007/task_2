'use strict';

module.exports = {

   async up(queryInterface, Sequelize) {

      await queryInterface.removeColumn('Products', 'subcategoryId');
      
      await queryInterface.addColumn('Products', 'categoryId', {
        type: Sequelize.INTEGER,
        references: {model: 'Categories'}
      });

      await queryInterface.dropTable('Subcategories');

      await queryInterface.addColumn('Categories', 'parentId', {
         type: Sequelize.INTEGER,
         references: {model: 'Categories'},
      });

  
   },

  async down(queryInterface, Sequelize) {

   await queryInterface.removeColumn('Categories', 'parentId');

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

   await queryInterface.removeColumn('Products', 'categoryId');

   await queryInterface.addColumn('Products', 'subcategoryId', {
      type: Sequelize.INTEGER,
      references: {model: 'Subcategories'}
   });
    
  }

};