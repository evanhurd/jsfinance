var Transaction = require('./transaction.js')
 	, Money = require('./money.js')
	, Category = require('./category.js');

Transaction.addHook('afterCreate', 'CreateMoney', createMoney);

function createMoney(transaction, options){
	Money.create({
		  transactionId:transaction.id
		, description: transaction.description
		, debit:transaction.debit
		, credit: transaction.credit
		, categoryId:options.categoryId
		, date : transaction.date
	})
	.then(function(money){
		//transaction.getMoney().then(function() {});
	})
	.catch(function(err){
		throw Error(err);
	});	
}
