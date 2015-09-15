function ActionData(){
	return this;
}


ActionData.prototype.get = function(data, callback){
	var data = this.dataModel(data);
	new exec('action', 'get',data)
	.done(callback)
	.fail(callback);
}

ActionData.prototype.update = function( data, callback){
	var data = this.dataModel(data);
	new exec('action', 'update',data)
	.done(callback)
	.fail(callback);
}

ActionData.prototype.create = function(data, callback){
	var data = this.dataModel(data);
	new exec('action', 'create',data)
	.done(callback)
	.fail(callback);
}

ActionData.prototype.delete = function(data, callback){
	var data = this.dataModel(data);
	new exec('action', 'destroy',data)
	.done(callback)
	.fail(callback);
}

ActionData.prototype.run = function(data, callback){
	var data = this.dataModel(data);
	new exec('action', 'execute',data)
	.done(callback)
	.fail(callback);
}

ActionData.prototype.runAll = function(data, callback){
	var data = this.dataModel(data);
	new exec('action', 'RunCategoryActions',data)
	.done(callback)
	.fail(callback);
}


ActionData.prototype.dataModel = function(data){
	return {
		  id :data.id || undefined
		, order :data.order || undefined 
		, categoryId :data.categoryId || undefined
		, name :data.name || undefined
		, filter :data.filter || undefined
		, toCategoryId :data.toCategoryId || undefined
		, amount :data.amount || undefined
		, active :data.active || undefined
	};
}
	


	
