var db = require('../db.js')

var Category = db.define('category', {
	  id : { type: db.DataTypes.INTEGER, unique: 'compositeIndex', primaryKey: true, autoIncrement: true}
	, name : db.DataTypes.STRING
	, description : db.DataTypes.STRING
	, balance : {type: db.DataTypes.DECIMAL(10,2), defaultValue: 0 }
},{
	instanceMethods: {
		createChild:function(){
			var attributes = arguments[0] || {}
			var args = argumentsToArray(arguments);
			if(args.length == 0) args.push(attributes);
			args[0].categoryId = this.id;
			return Category.create.apply(Category,args);
		}
	}

});

function argumentsToArray(args){
	var a = [];
	for(i = 0;i < args.length;i++){
		a.push(args[i]);
	}
	return a;
}

module.exports = Category;

