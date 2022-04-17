const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('car_store_db', 'root', process.env['MYSQL_PASSWORD'], {
   dialect: 'mysql',
   host: 'localhost',
   define: {
      timestamps: false,
   }
});

module.exports = sequelize.define('order', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
   },
})