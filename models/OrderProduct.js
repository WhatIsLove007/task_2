const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('car_store_db', 'root', process.env['MYSQL_PASSWORD'], {
   dialect: 'mysql',
   host: 'localhost',
   define: {
      timestamps: false,
   }
});

module.exports = sequelize.define('order_product', {
   user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   order_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
})