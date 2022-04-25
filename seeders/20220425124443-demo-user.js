'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'elonmusk@gmail.com',
        password: '$2b$10$sO5octfPuuba9h3epBhihesHUisCwB32giEaorgvVDoGiq6hMCAPC',
        account: 7600000.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'billgates@gmail.com',
        password: '$2b$10$fnCuU/JyXhH50noAQLjhb.SV/13RoBMtAyFIH1cNkFPnnmOo5qhHS',
        account: 999999.98,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'wtf.evgesha@gmail.com',
        password: '$2b$10$Z6V6rl10Rx5E6m1JdCCrbeahNP4RnEmMOuQAcsPAvLlaMSVaQLSMG',
        account: 100.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'nahornyi.vlad@gmail.com',
        password: '$2b$10$yInzlrAtgeDiBBySt7eAYux9auIWV7UofYzd/PKZnw/7Xsah7yxCJ',
        account: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', null, {});
  }
};
