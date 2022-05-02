'use strict';

module.exports = {
   async up(queryInterface, Sequelize) {

      await queryInterface.addColumn('Orders', 'orderPrice', {
         type: Sequelize.DECIMAL(11, 2),
      });

   },

   async down(queryInterface, Sequelize) {

      await queryInterface.removeColumn('Orders', 'orderPrice');
    
   }

};