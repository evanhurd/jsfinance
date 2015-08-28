var db = require('../db.js');

var Money = db.define('money', {
	  id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, description : db.DataTypes.STRING
	, debit : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
	, credit : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
	, balance : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
	, date : db.DataTypes.DATEONLY
});

module.exports = Money;