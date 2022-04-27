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
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'Sports car'}}, ['id']),
      },
      {
        name: 'Tesla Roadster',
        description: 'The Tesla Roadster is an upcoming all-electric battery-powered all-wheel-drive sports car.',
        price: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'Sports car'}}, ['id']),
      },
      {
        name: 'Ferrari F40',
        description: 'The Ferrari F40 is a mid-engine, rear-wheel drive sports car engineered by Nicola Materazzi.',
        price: 1625000,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'Sports car'}}, ['id']),
      },
      {
        name: 'Lamborghini Urus',
        description: 'The Lamborghini Urus is a high performance luxury SUV manufactured by Lamborghini.',
        price: 218100,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'SUV'}}, ['id']),
      },
      {
        name: 'McLaren 720S',
        description: 'The McLaren 720S is a sports car designed by British automobile manufacturer McLaren Automotive.',
        price: 301500,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'Sports car'}}, ['id']),
      },
      {
        name: 'Aston Martin Vantage Coupe Trims',
        description: 'The Aston Martin Vantage is a two-seater sports car manufactured by British luxury car manufacturer Aston Martin.',
        price: 146980,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'Sports car'}}, ['id']),
      },
      {
        name: 'Bentley Continental GT',
        description: 'The Bentley Continental GT is a grand tourer manufactured and marketed by British automaker Bentley Motors.',
        price: 222700,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'Grand tourer'}}, ['id']),
      },
      {
        name: 'Rolls-Royce Ghost',
        description: 'The Rolls-Royce Ghost is a full-sized luxury car manufactured by Rolls-Royce Motor Cars.',
        price: 311900,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategoryId: await queryInterface.rawSelect('Subcategories', {where: {name: 'Full-size luxury car'}}, ['id']),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Products', null, {});
  }
};
