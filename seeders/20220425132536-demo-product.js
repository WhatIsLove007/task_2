'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Lamborghini Veneno Roadster',
        description: 'The Lamborghini Veneno is a limited production high performance sports car.',
        price: 4500000,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 1,
      },
      {
        name: 'Tesla Roadster',
        description: 'The Tesla Roadster is an upcoming all-electric battery-powered all-wheel-drive sports car.',
        price: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 1,
      },
      {
        name: 'Ferrari F40',
        description: 'The Ferrari F40 is a mid-engine, rear-wheel drive sports car engineered by Nicola Materazzi.',
        price: 1625000,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 1,
      },
      {
        name: 'Lamborghini Urus',
        description: 'The Lamborghini Urus is a high performance luxury SUV manufactured by Lamborghini.',
        price: 218100,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 1,
      },
      {
        name: 'McLaren 720S',
        description: 'The McLaren 720S is a sports car designed by British automobile manufacturer McLaren Automotive.',
        price: 301500,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 1,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Products', null, {});
  }
};
