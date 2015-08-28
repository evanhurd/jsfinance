var db = require('../db.js');

var Action_Match = db.define('action_match', {
	  actionId : db.DataTypes.INTEGER
	, match : db.DataTypes.STRING
});

module.exports = Action_Match;