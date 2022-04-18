const Sequelize = require('sequelize').Sequelize;

module.exports = new Sequelize('car_store_db', 'root', process.env['MYSQL_PASSWORD'], {
   dialect: 'mysql',
   dialectOptions: {
      decimalNumbers: true
   },
   host: 'localhost',
});
