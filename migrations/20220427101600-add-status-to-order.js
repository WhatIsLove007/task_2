'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'status', {
      type: Sequelize.ENUM,
      values: ['SHOPPING CART', 'IN PROCESSING', 'CONFIRMED', 'BEING DELIVERED', 'DELIVERED', 'RECEIVED', 'FAILED'],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'status');
  }

};