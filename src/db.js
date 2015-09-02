var Sequelize = require('sequelize');

var sequelize = new Sequelize('jsfinance', 'root', 'stingray', {
  host: '127.0.0.1',
  port : 3306,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  logging : true
});

sequelize.DataTypes = Sequelize;

module.exports = sequelize;
