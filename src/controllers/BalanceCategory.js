var router = require('../router.js');
var MoneyTransfer = require('../controllers/MoneyTransfer.js');
var Category = require('../controllers/category.js');
var db = require('../db.js');
var Run = require('./run.js');

router.register('BalanceCategory', 'balance', function(reply, data){
	var category = data.category || 0;
	var fromCategory = data.fromCategory || 0;

	if(category == 0 || fromCategory == 0){
		return reply({"error":true, "message":"Invalid Category!"});
	}

	BalanceCategory(
		reply,
		fromCategory,
		category,
		0
	);
});

function BalanceCategory(reply, fromCategory, toCategory, actionId){
	new Run({
			reply : reply,
			fromCategory : fromCategory,
			toCategory : toCategory,
			actionId : actionId
		},
		function (next){
			console.log('HA!');

			Category.getBalance(next, {id:this.toCategory});
		},

		function (next, balance){
			this.balance = balance;
			this.loopNext = next;
			next();
		},

		function (next){
			console.log('HA!');
			if(this.balance < 0){
				next();
			}else{
				this.reply(true);
			}
		},

		function (next){
			console.log('here');
			Category.getSmallestCredit(next,{id:this.fromCategory});
		},

		function (next, creditMoney){

			if((this.balance * -1) <= creditMoney.credit){
				var amount = (this.balance * -1);
			}else{
				var amount = creditMoney.credit;
			}

			new MoneyTransfer({
				  money : creditMoney.id
				, category : this.toCategory
				, amount : amount
				, action : this.actionId
			}, next);
		},

		function(next, newMoney, transfer) {
			this.balance+=newMoney.credit;
			this.loopNext();
		}

	)();
}


module.exports = BalanceCategory;