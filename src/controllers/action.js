var router = require('../router.js');
var Action = require('../models/action.js');
var Money = require('../models/money.js');
var MoneyTransfer = require('../controllers/MoneyTransfer.js');
var BalanceCategory = require('../controllers/BalanceCategory.js');
var Transfer = require('../models/transfer.js');
var db = require('../db.js');
var Run = require('./run.js');

router.register('action', 'create', create);
router.register('action', 'get', get);
router.register('action', 'update', update);
router.register('action', 'getOrdered', getOrdered);
router.register('action', 'destroy', destroy);
router.register('action', 'execute', execute);
router.register('action', 'RunCategoryActions', RunCategoryActions);

module.exports = {
	destroy : destroy,
	create : create,
	get : get,
	execute : execute,
	RunCategoryActions : RunCategoryActions
};


function destroy(reply, data) {
	if(data.id == undefined) {
		return reply(false);
	}
	Action.destroy({where:data})
	.then(function(rowsAffected){
		if(rowsAffected > 0){
			reply(true);
		}else{
			reply({error:true, message : "No Action found to delete!"});
		}
	})
	.error(function(err){
		reply(err);
	});	
}

function create(reply, data) {
	Action.create(data)
	.then(function(category){
		reply(category);
	})
	.error(function(err){
		reply(err);
	});	
}

function update(reply, data) {
	var id=data.id;
	data.id = undefined;
	Action.update(data, {where:{id:id}})
	.then(function(metadata){
		if(metadata && metadata.length > 0 && metadata[0] > 0){
			reply(true);
		}else{
			reply({error:true, message : "No Action found to update!"});
		}
	})
	.error(function(err){
		reply(err);
	});	
}


function get(reply, data) {
	Action.findAll({ where : data })
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		console.log(err);
		reply(err);
	});	
}

function getOrdered(reply, data) {
	Action.findAll({ where : data, order: '`order` ASC, `name` ASC' })
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		console.log(err);
		reply(err);
	});	
} 

function execute(reply, data) {
	var actionId = data.id;
	new Run(reply,
	function(next){
		Action.findOne({ where : {id:actionId}})
		.then(next)
		.error(function(err){
			console.log(err);
			reply(err);
		});	
	},

	function(next, action){
		if(action.filter == 'BALANCE'){
			new BalanceCategory(reply, action.toCategoryId, action.categoryId, action.id );
		}else{
			next(action);	
		}
	},

	function(next, action){
		var sql = " select money.* from money";
  			sql+= "	left outer join transfers on transfers.transactionId = money.transactionId";
  			sql+= "		and transfers.actionId = :actionId ";
  			sql+= " where transfers.id is null";
  			sql+= "		and money.categoryId = :categoryId ";
  			sql+= "		and money.description like :filter ;";
		db.query(sql,
			{ replacements: { 
				categoryId: action.categoryId,
				actionId : action.id,
				filter : action.filter
			}, type: db.QueryTypes.SELECT }
		).then(next.bind(action,action))
		.error(function(err){
			console.log(err);
			reply(err);
		});
	},

	function(next, action, monies){
		var runNext = function(data){
			var money = data.monies[data.index];
			new MoneyTransfer({
				  money : money.id
				, category : data.action.toCategoryId
				, amount : data.action.amount
				, action : data.action.id
			}, data.next);
		};

		var data = {
			index : -1,
			count : monies.length,
			monies : monies,
			action : action
		};
		data.next = next.bind(data,data);
		data.runNext = runNext.bind(data,data);
		data.next();
	},

	function(next, data, newMoney, transfer){
		data.index++;
		console.log(data.index, data.count);
		if(data.index < data.count){
			data.runNext();
		}else{
			next();
		}
		
	},

	function(){
		this(true);
	}

	)();
} 

function RunCategoryActions(reply, data){
	new Run({
			reply : reply,
			category : data.categoryId
		},
		function(){
			this.loopNext = next;
			getOrdered({categoryId : this.category, active: 1})
			.then(next)
			.catch(function(err){
				console.log(err);
				this.reply(false);
			});
		},

		function (next, actions){
			this.actions = actions;
			var action = false;
			if( (action == this.actions.shift())) {
				execute(this.loopNext,action.id);
			}else{
				next();
			}
		},

		function (){
			reply(true);
		}
	)();
}
