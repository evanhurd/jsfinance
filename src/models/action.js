var db = require('../db.js');
var Action_Match = require('./action_match.js');
var Action_Exec = require('./action_exec.js');

var Action = db.define('action', {
	 id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, order : db.DataTypes.INTEGER
	, categoryId : db.DataTypes.INTEGER
	, name : db.DataTypes.STRING
	, filter : db.DataTypes.STRING
	, toCategoryId : db.DataTypes.INTEGER
	, amount : db.DataTypes.STRING
	, active : db.DataTypes.INTEGER
});

module.exports = Action; 
