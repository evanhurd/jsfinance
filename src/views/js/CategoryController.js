function CategoryController(){
	//Setup ToolBar
	$('.program-window-toolbar-left').append(
		this.$newButton = new ToolbarButton("plus-sign"),
		this.$editButton = new ToolbarButton("pencil")
	);
	$('.program-window-toolbar-right').append(
		this.$actionEditButton = new ToolbarButton("wrench"),
		//this.$otherButton = new ToolbarButton("usd"),
		//this.$otherButton = new ToolbarButton("transfer"),
		//this.$otherButton = new ToolbarButton("resize-full"),
		//this.$otherButton = new ToolbarButton("resize-small")
		this.$createActionFromMoneyButton = new ToolbarButton("plane")
	);
	this.$newButton.onclick = this.startCreateNewProcess.bind(this);
	this.$editButton.onclick = this.startEditProcess.bind(this);
	this.$actionEditButton.onclick = function(){
		if(this.activeCategory) {
			new ActionController(this.activeCategory).show();
		}
	}.bind(this);
	this.$createActionFromMoneyButton.onclick = function(){
		if(this.activeCategory && this.activeCategory.MoneyController) {
			var selectedMonies = false;
			if((selectedMonies = this.activeCategory.MoneyController.getSelectedMonies()).length > 0){
				var selectedMonies = selectedMonies[0];
				var actionSettings = {
					id : 0,
					filter : selectedMonies.description,
					amount : selectedMonies.credit || selectedMonies.debit
				};
				new ActionController(this.activeCategory).addNewAction(actionSettings);
				this.activeCategory.MoneyController.clearSelectedMonies();
			}
			
		}
	}.bind(this);
	this.$newButton.disable();
	this.$editButton.disable();

	this.categoryData = new CategoryData();
	this.categoryView = new CategoryView();
	this.activeCategory = false;
	$('.program-window-sidebar').append(this.categoryView.element);
	this.init();
}


CategoryController.prototype.loadCategories = function(categories){
	for(var i = 0; i < categories.length;i++) {
		var category = new Category(categories[i]);
		category._activate = this.activateCategory.bind(this,category);
		if(category.id == 1){
			this.rootCategory = category;
			category.categoryId = 1;
		}
		this.categoryView.add(category);
		category.MoneyController = new MoneyController(category);
	}
}


CategoryController.prototype.activateCategory = function(category){
	if(this.activeCategory && category != this.activeCategory){
		this.activeCategory.isActive = 0;
	}
	this.activeCategory = category;
	category.isActive = 1;
	this.$newButton.enable();
	this.$editButton.enable();
}

CategoryController.prototype.init = function(category){
	new Run(this,
		function(next){
			this.categoryData.get({}, next);
		},

		function(next, data){
			this.loadCategories(data);
			next();
		},
		function(){
			if(this.rootCategory)this.activateCategory(this.rootCategory);
		}
	)();
}

CategoryController.prototype.startCreateNewProcess = function(){
	if(!this.activeCategory) return false;
	new Run(this,
		function(next){
			var a = new NewCategoryView();
			a.onSave = next;
		},
		function(next, newCategoryName){
			var parentId = this.activeCategory.id;
			this.categoryData.create({categoryId:parentId, name:newCategoryName}, next)
		}, function(next, newCategory){
			if(newCategory && newCategory.id){
				this.loadCategories([newCategory]);
			}else{
				displayMessage('Failed to create category!');
			}
		}
	)();
}

CategoryController.prototype.startEditProcess = function(){
	if(!this.activeCategory) return false;
	new Run(this,
		function(next){
			var a = new EditCategoryView(this.activeCategory);
			a.onSave = next;
			a.onDelete = this.deleteCategory.bind(this,this.activeCategory);
		},
		function(next, newCategoryName){
			var id = this.activeCategory.id;
			this.categoryData.update({id:id, name:newCategoryName},
				next.bind(newCategoryName,newCategoryName)
			);
		}, function(next, newCategoryName, updateReply){
			if(updateReply){
				this.activeCategory.name = newCategoryName;
			}else{
				displayMessage('No records updated!');
			}
		}
	)();
}

CategoryController.prototype.deleteCategory = function(category){
	if(category.id == 1) return false;
	if(category == this.activeCategory && category._parent){
		this.activateCategory(category._parent);
	}
	this._deleteCategory = category;
	new Run(this,
		function(next){
			this.categoryData.delete({id:this._deleteCategory.id}, next);
		},
		function(next, reply){
			if(isError(reply) == false && reply){
				this.categoryView.remove(this._deleteCategory);
			}else{
				displayMessage(reply);
			}
		}
	)();
}

CategoryController.prototype.getNameByCategoryId = function(id){
	if(this.categoryView.viewChildren[id]){
		return this.categoryView.viewChildren[id].name;
	}else{
		return false;
	}
}

CategoryController.prototype.reload = function(category){
	var category = arguments[0] || this.activeCategory;

	new Run(
		{
			category : category,
			this : this
		},

		function(next){
			//this.category.MoneyController.clearAllMonies();
			next();
		},

		function(next){
			exec('category', 'updateBalance',{
				id : this.category.id
			})
			.done(function(next,response){
				next();
			}.bind(this, next))
			.fail(function(next, response){
				console.log(response);
				next();
			}.bind(this, next));				
		},

		function(next){
			exec('category', 'getBalance',{
				id : this.category.id
			})
			.done(function(next,balance){
				if(balance <= 0 || balance > 0){
					this.category.balance = balance;
				}
				next();
			}.bind(this, next))
			.fail(function(next, response){
				next();
			}.bind(this, next));	
		},

		function(){
			//this.category.MoneyController.reload();
		}

	)();
}