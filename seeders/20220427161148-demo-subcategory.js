'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Subcategories', [
      {
        name: 'Grand tourer',
        categoryId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Full-size luxury car',
        categoryId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sports car',
        categoryId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'SUV',
        categoryId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Subcategories', null, {});
  }
};
