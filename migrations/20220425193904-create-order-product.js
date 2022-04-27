'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderProducts', {
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      orderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Orders'},
        onDelete: 'cascade',
      },
      productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Products'},
        onDelete: 'cascade',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderProducts');
  }
};