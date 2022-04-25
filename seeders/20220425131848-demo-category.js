'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Cars',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Spare Parts',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Categories', null, {});
  }
};
