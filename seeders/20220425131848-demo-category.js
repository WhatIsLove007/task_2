// 'use strict';

// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.bulkInsert('Categories', [
//       {
//         name: 'Cars',
//         parentId: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Spare Parts',
//         parentId: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Grand tourer',
//         parentId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Full-size luxury car',
//         parentId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Sports car',
//         parentId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'SUV',
//         parentId: 13,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ], {});
//   },

//   async down (queryInterface, Sequelize) {
//     queryInterface.bulkDelete('Categories', null, {});
//   }
// };



'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Cars',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Spare Parts',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },    
    ], {});

    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Grand tourer',
        parentId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Full-size luxury car',
        parentId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sports car',
        parentId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'SUV',
        parentId: await queryInterface.rawSelect('Categories', {where: {name: 'Cars'}}, ['id']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    
    ], {});

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Categories', {
      parentId: await queryInterface.rawSelect('Categories', {where: {parentId: null}}, ['id'])
    }, {});

    await queryInterface.bulkDelete('Categories', {parentId: null}, {});

  }

};