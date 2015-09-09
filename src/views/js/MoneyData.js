function MoneyData(){
	return this;
}


MoneyData.prototype.get = function(data, callback){
	var data = this.dataModel(data);
	new exec('money', 'get',data)
	.done(callback)
	.fail(callback);
}

MoneyData.prototype.update = function(data, callback){

}

MoneyData.prototype.create = function(data, callback){
	var data = this.dataModel(data);
	new exec('money', 'create',data)
	.done(callback)
	.fail(callback);
}

MoneyData.prototype.delete = function(data, callback){
	var data = this.dataModel(data);
	new exec('money', 'destroy',data)
	.done(callback)
	.fail(callback);
}

MoneyData.prototype.getOrdered = function(data, callback){
	var data = this.dataModel(data);
	new exec('money', 'getOrdered',data)
	.done(callback)
	.fail(callback);
}

MoneyData.prototype.dataModel = function(data){
	return {
		  id : data.id || undefined
		, description : data.description || undefined 
		, categoryId : data.categoryId || undefined
		, createdAt : data.createdAt || undefined
		, debit : data.debit || undefined
		, credit : data.credit || undefined
		, balance : data.balance || undefined
		, fromIndex : data.fromIndex || undefined
		, toIndex : data.toIndex || undefined
	};
} 
