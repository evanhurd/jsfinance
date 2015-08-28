var   Transaction = require('./transaction.js')
	, Money = require('./money.js') 
	, Category = require('./category.js')
	, Action = require('./action.js');

Category.hasMany(Money);
Category.hasMany(Category);
Transaction.hasMany(Money);
//Money.hasOne(Transaction);


