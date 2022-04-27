'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Users', 'password', 'passwordHash');
  },

  async down(queryInterface, Sequelize) {
   await queryInterface.renameColumn('Users', 'passwordHash', 'password');
  }

};