var db = require('../db.js');

var Action_Exec = db.define('action_exec', {
	  actionId : db.DataTypes.INTEGER
	, amount : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
	, pull_credit : db.DataTypes.INTEGER
	, move_to : db.DataTypes.INTEGER
});

module.exports = Action_Exec; 
