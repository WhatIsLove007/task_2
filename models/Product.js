const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('car_store_db', 'root', process.env['MYSQL_PASSWORD'], {
   dialect: 'mysql',
   dialectOptions: {
      decimalNumbers: true
   },
   host: 'localhost',
   define: {
      timestamps: false,
   }
});

module.exports = sequelize.define('product', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
   },
   description: {
      type: Sequelize.TEXT,
      allowNull: false,
   },
   category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
   },
});