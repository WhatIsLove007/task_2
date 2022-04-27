'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'account');
  },

  async down(queryInterface, Sequelize) {
   await queryInterface.addColumn('Users', 'account', {
      type: Sequelize.DECIMAL(11, 2),
      allowNull: false,
      defaultValue: 0,
   });
  }

};