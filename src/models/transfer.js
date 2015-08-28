var db = require('../db.js')

var Transfer = db.define('transfer', {
	  id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, actionId : db.DataTypes.INTEGER
	, moneyId : db.DataTypes.INTEGER
	, transactionId : db.DataTypes.INTEGER
	, new_moneyId : db.DataTypes.INTEGER
	, categoryId : db.DataTypes.INTEGER
	, from_categoryId : db.DataTypes.INTEGER
	, debit : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
	, credit : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
});

module.exports = Transfer;