'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'status', {
      type: Sequelize.ENUM,
      values: ['SHOPPING CART', 'PAID', 'BEING DELIVERED', 'DELIVERED', 'RECEIVED'],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'status');
  }

};