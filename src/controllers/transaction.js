var router = require('../router.js');
var Transaction = require('../models/transaction.js');

router.register('transaction', 'create', create);
router.register('transaction', 'get', get);
router.register('transaction', 'destroy', destroy);


module.exports = {
	destroy : destroy,
	create : create,
	get : get,
	createIfNotExists : createIfNotExists
};

function destroy(reply, data) {
	if(data.id == undefined && data.parent == undefined) {
		return reply(false);
	}
	data.categoryId = undefined;
	Transaction.destroy({where:data})
	.then(function(transaction){
		reply(true);
	})
	.error(function(err){
		reply(err);
	});	
}

function create(reply, data) {
	var categoryId = data.categoryId || 1;
	data.categoryId = undefined;
	Transaction.create(data,{categoryId:categoryId})
	.then(function(transaction){
		reply(transaction);
	})
	.error(function(err){
		reply(err);
	});	
}


function get(reply, data) {
	data.categoryId = undefined;
	delete data.categoryId;
	Transaction.findAll({ where : data })
	.then(function(rows){
		reply(rows);
	})
	.error(function(err){
		reply(err);
	});	
}

function createIfNotExists(reply, transaction){
	(function(reply, transaction){
	  	get(function(rows){
	    	if(rows.length == 0){
	      		create(function(row){
					reply(row);
	      		}, transaction);
	    	}else{
	      		reply(transaction);
	    	}
	  	}, transaction);	  	
	})(reply, transaction);
}