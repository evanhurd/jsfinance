module.exports = MoneyTransfer;
var Transfer = require('../models/transfer.js');
var Money = require('../models/money.js');
var Category = require('../models/category.js');
var db = require('../db.js');
var router = require('../router.js');

router.register('MoneyTransfer', 'transfer', function(reply, data){
	var moneyId = data.money || 0;
	var toCategory = data.category || 0;
	var amount = data.amount || 0;
	if(toCategory == 0){
		return reply({"ERROR":true, "MESSAGE":"Invalid Category!"});
	}
	if(moneyId == 0){
		return reply({"ERROR":true, "MESSAGE":"Invalid Money!"});
	}
	MoneyTransfer({
		money : moneyId,
		category : toCategory,
		amount : amount
	}, reply);
});


function MoneyTransfer(options, callBack){
	var moneyId = options.money || 0,
		categoryId = options.category || 0,
		amount = options.amount || 0,
		description = options.description || '',
		action = options.action || 0;

	db.transaction({isolationLevel: 'READ COMMITTED' })
	.then(function(t){
		var sql = " select money.*, transactions.debit as ndebit, transactions.credit as ncredit ";
			sql+= "	from money";
			sql+= "	inner join transactions on transactions.id = money.transactionId";
			sql+= "	where money.id = :moneyId ";
		db.query(sql,
			{ model : Money, replacements: { 
				moneyId: moneyId
			}, type: db.QueryTypes.SELECT }
		).then(function(monies){	 /*Money.findOne({where:{id:moneyId}}).then*/

			if(monies.length == 0){
				t.rollback();
				callBack(new Error('Money could not be found!!!'));
				return false;
			}
			var money = monies[0];

			if(money.debit > 0){
				var type = 'debit';
			}else if(money.credit > 0){
				var type = 'credit';
			}else{
				t.rollback();
				callBack(new Error('Money had no debit or credits!!!'));
				return false;
			}

			description = description || money.description;

			if(amount.toString().indexOf('%N') > 0){
				
				var percent = new Number(amount.toString().replace('%N', ''));
				console.log('b');
				amount = (percent * new Number(money.dataValues['n'+type])) / 100;
				console.log('c');
			}else if(amount.toString().indexOf('%') > 0){
				var percent = new Number(amount.toString().replace('%', ''));
				amount = (percent * new Number(money[type])) / 100;				
			}



			if(amount <= 0 || amount >= money[type]) {

				return moveMoney(t, money, categoryId, complete.bind(money, money));
			}else{
				return movePartial(t, money, categoryId,type, amount, description, complete.bind(money, money));
			}


			function complete(money1, money2){
				//console.log(money1.id, money2.id);
				if(isError(money2)){
					t.rollback();
					return callBack(money2);
				}
				return Transfer.create({
					  actionId : action
					, moneyId : money1.id
					, new_moneyId : money2.id
					, transactionId : money2.transactionId
					, categoryId : money2.categoryId
					, from_categoryId : money1.categoryId
					, debit : money2.debit
					, credit : money2.credit
				}, {transaction: t})
				.then(function(transfer){
					t.commit();
					return callBack(money2, transfer);
				})
				.catch(function(err){
					t.rollback();
					callBack(err);
				})
			}
		}).
		catch(function(err){
			t.rollback();
			console.log(err);
			return callBack(err);
		});
	})
	.then(function(result){

	})
	.catch(function(err){
		console.log(err);
	});


}

function moveMoney(t,money, toCategory, returnFunc) {
	return getCategoryOrFail(toCategory, function(category){
		if(isError(category)){
			return returnFunc(category);
		}
		money.categoryId = category.id;
		money.save({transaction: t})
		.then(function(){returnFunc(money)})
		.catch(function(err){t.rollback(); returnFunc(err)});
	});
}

function movePartial(t, money, toCategory, type, amount, description, returnFunc){
	getCategoryOrFail(toCategory, function(category){
		if(!category){
			throw new Error("Invalid category!");
		}
		money[type] = money[type] - amount;
		money.save().catch(function(err){t.rollback(); returnFunc(err);});
		var newMoney = {
			  transactionId: money.transactionId
			, categoryId : category.id
			, description : description
			, date : money.date
		};

		newMoney[type] = amount;
		Money.create(newMoney, {transaction: t})
		.then(function(money){returnFunc(money)})
		.catch(function(err){ t.rollback(); returnFunc(err);});
	});
}


function getCategoryOrFail(categoryId, returnFunc){
	Category.findOne({where:{id:categoryId}}).then(function(category){
		if(category){
			returnFunc(category);
		}else{
			returnFunc(new Error("Could not find category!"));
		}
		
	}).
	catch(function(err){
		throw err;
		returnFunc(new Error("Database Error while finding category!"));
	});	
}


function isError(reply){
	if(reply == null || reply == undefined){
		return false;
	}
	return reply instanceof Error ? true : false;
}