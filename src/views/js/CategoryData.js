function CategoryData(){

}


CategoryData.prototype.get = function(data, callback){
	var data = this.dataModel(data);
	exec('category', 'getOrdered',data)
	.done(callback)
	.fail(callback);
}

CategoryData.prototype.update = function(data, callback){
	var data = this.dataModel(data);
	exec('category', 'update',data)
	.done(callback)
	.fail(callback);
}

CategoryData.prototype.create = function(data, callback){
	var data = this.dataModel(data);
	exec('category', 'create',data)
	.done(callback)
	.fail(callback);
}

CategoryData.prototype.delete = function(data, callback){
	var data = this.dataModel(data);
	exec('category', 'deleteCategory',data)
	.done(callback)
	.fail(callback);
}

CategoryData.prototype.dataModel = function(data){
	return {
		  name : data.name || undefined
		, description : data.description || undefined 
		, categoryId : data.categoryId || undefined
		, id : data.id || undefined
	};
}