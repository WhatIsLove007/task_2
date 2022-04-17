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

module.exports = sequelize.define('user', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
   },                            // can use validate: {isEmail: true}
   password: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   account: {
      type: Sequelize.DECIMAL(11, 2),
      allowNull: false,
   }
});
