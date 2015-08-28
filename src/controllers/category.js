var router = require('../router.js');
var Category = require('../models/category.js');
var Transaction = require('../models/transaction.js');
var Run = require('./run.js');
var Money = require('../models/money.js');
var db = require('../db.js');

router.register('category', 'create', create);
router.register('category', 'get', get);
router.register('category', 'update', update);
router.register('category', 'getOrdered', getOrdered);
router.register('category', 'destroy', destroy);
router.register('category', 'deleteCategory', deleteCategory);
router.register('category', 'updateBalance', updateBalance);
router.register('category', 'getBalance', getBalance);

module.exports = {
	destroy : destroy,
	create : create,
	get : get,
	getShortList : getShortList,
	getBalance : getBalance,
	getSmallestCredit : getSmallestCredit
};

function deleteCategory(reply, data) {
	if(data.id == undefined || data.id == 0) {
		return reply(false);
	}
	Money.findOne({ where : {categoryId:data.id }})
	.then(function(rows){
		if(rows) {
			reply({error:true, message : " Cannot remove categories that contains transactions!"});	
		}else{
			destroy(reply, {id: data.id});
		}
	})
	.error(function(err){
		reply(err);
	});	
}

function destroy(reply, data) {
	if(data.id == undefined) {
		return reply(false);
	}
	Category.destroy({where:data})
	.then(function(rowsAffected){
		if(rowsAffected > 0){
			reply(true);
		}else{
			reply({error:true, message : "No category found to delete!"});
		}
	})
	.error(function(err){
		reply(err);
	});	
}

function create(reply, data) {
	Category.create(data)
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
	Category.update(data, {where:{id:id}})
	.then(function(metadata){
		if(metadata && metadata.length > 0 && metadata[0] > 0){
			reply(true);
		}else{
			reply({error:true, message : "No category found to update!"});
		}
	})
	.error(function(err){
		reply(err);
	});	
}


function get(reply, data) {
	Category.findAll({ where : data })
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		reply(err);
	});	
}

function getOrdered(reply, data) {
	Category.findAll({ where : data, order: '`categoryId` ASC, `name` ASC' })
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		console.log(err);
		reply(err);
	});	
}


function getShortList(reply, data) {
	Category.findAll({ attributes: ['id', 'name'], where : data })
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		reply(err);
	});	
}

function updateBalance(reply, data) {
	data.reply =reply;
	new Run(data,
		function(next){
			var sql = "CALL update_category_balance(:categoryId);";
			db.query(sql,
				{ replacements: { 
					categoryId: this.id
				}, type: db.QueryTypes.SELECT }
			).then(next)
			.error(function(err){
				console.log(err);
				this.reply(err);
			}.bind(this))
		},

		function(next, response){
			this.reply(true);
		}
	)();
}

function getBalance(reply, data) {
	data.reply =reply;
	new Run(data,
		function(next){
			var sql = "select SUM(credit - debit) as balance from money where categoryId = :id ;";
			db.query(sql,
				{ replacements: { 
					id: this.id
				}, type: db.QueryTypes.SELECT }
			).then(next)
			.error(function(err){
				console.log(err);
				reply(err);
			});
		},

		function(next, response){
			console.log(response);
			this.reply(response.length > 0 ? response[0].balance : null);
		}
	)();
}

function getSmallestCredit(reply, data) {
	data.reply =reply;
	new Run(data,
		function(next){
			var sql = "select MIN(credit - debit), money.* from money where categoryId = :id and credit > 0;";
			db.query(sql,
				{ model : Money, replacements: { 
					id: this.id
				}, type: db.QueryTypes.SELECT }
			).then(next)
			.error(function(err){
				console.log(err);
				reply(err);
			});
		},

		function(next, response){
			this.reply(response[0]);
		}
	)();
}