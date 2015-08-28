var db = require('../db.js');

var Transaction = db.define('transaction', {
	  id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, description : db.DataTypes.STRING
	, date : db.DataTypes.DATEONLY
	, debit : db.DataTypes.DECIMAL(10,2)
	, credit : db.DataTypes.DECIMAL(10,2)
	, check : db.DataTypes.STRING
	, balance : db.DataTypes.DECIMAL(10,2)
});

module.exports = Transaction;