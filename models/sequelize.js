import Sequelize from 'sequelize';

export const sequelize = new Sequelize('car_store_db', 'root', process.env['MYSQL_PASSWORD'], {
   dialect: 'mysql',
   dialectOptions: {
      decimalNumbers: true
   },
   host: 'localhost',
});

export default sequelize;