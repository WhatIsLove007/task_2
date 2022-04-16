const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('car_store_db', 'root', process.env['MYSQL_PASSWORD'], {
   dialect: 'mysql',
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
   country: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   price: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   category: {
      type: Sequelize.STRING,
      allowNull: false,
   },
})