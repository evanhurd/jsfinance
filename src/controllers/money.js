var router = require('../router.js');
var Money = require('../models/money.js');
var Transaction = require('../models/transaction.js');
var db = require('../db.js');

router.register('money', 'create', create);
router.register('money', 'get', get);
router.register('money', 'destroy', destroy);
router.register('money', 'getOrdered', getOrdered);

module.exports = {
	destroy : destroy,
	create : create,
	get : get,
	getOrdered : getOrdered
};


function destroy(reply, data) {
	if(data.id == undefined && data.parent == undefined) {
		return reply(false);
	}
	Money.destroy({where:data})
	.then(function(money){
		reply(true);
	})
	.error(function(err){
		reply(err);
	});	
}

function create(reply, data) {
	Money.create(data)
	.then(function(money){
		reply(money);
	})
	.error(function(err){
		reply(err);
	});	
}


function get(reply, data) {
	Money.findAll({ where : data})
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		console.log(err);
		reply(err);
	});	
	

}

function getOrdered(reply, data) {
	Money.findAll({ where : data, order: '`date` DESC, `id` DESC' })
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		console.log(err);
		reply(err);
	});	
}

