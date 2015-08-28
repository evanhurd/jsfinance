function ActionController(category){
	this.view = new ActionView();
	this.view.window.active = 0;
	this.view.window.title = "Actions - [ " + category.name + " ] ";
	this.category = category;
	this.actionData = new ActionData();
	this.view.$newActionButton.onClick(this.startNewActionProcess.bind(this));
	this.view.$editActionButton.onClick(this.startEditActionProcess.bind(this));
	this.view.$runActionButton.onClick(this.startRunActionProcess.bind(this));
	this.init();
	return this;
} 

ActionController.prototype.show = function(){
	this.view.window.active = 1;
}

ActionController.prototype.hide = function(){
	this.view.window.active = 0;
}

ActionController.prototype.init = function(){
	new Run(this,

		function(next){
			this.actionData.get({categoryId : this.category.id}, next);
		},

		function(next, reply){
			if(isError(reply) == false && reply){
				next(reply);
			}else{
				displayMessage(reply);
			}			
		},

		function(next, actions){
			this.loadActions(actions);
		}
	)();
}

ActionController.prototype.loadActions = function(actions){
	for(var i = 0; i < actions.length; i++){
		this.view.actions.add(new ActionModel(actions[i]));
	}
}

ActionController.prototype.addNewAction = function(actionSettings){
	return this.startNewActionProcess(actionSettings);
}

ActionController.prototype.startNewActionProcess = function(){
	var settings = arguments[0] || false;
	var view = ActionItemEditView(settings);
	new Run(this,
		function(next){
			view.onSave = next;
		},

		function(next, newAction){
			newAction.categoryId = this.category.id;
			this.actionData.create(newAction, next);
		},

		function(next, reply){
			if(isError(reply) == false && reply){
				next(reply);
			}else{
				displayMessage(reply);
			}	
		},

		function(next, newAction){
			this.view.actions.add(new ActionModel(newAction));
		}

	)();
}

ActionController.prototype.startEditActionProcess = function(){
	if(!this.view.selectedAction) return false;
	this.actionToEdit = this.view.selectedAction;
	var view = ActionItemEditView(this.actionToEdit);
	new Run(this,
		function(next){
			view.onSave = next;
		},

		function(next, editAction){
			editAction.id = this.actionToEdit.id;
			this.editActionObject = editAction;
			this.actionData.update(editAction, next);
		},

		function(next, reply){
			if(isError(reply) == false && reply){
				next(reply);
			}else{
				displayMessage(reply);
			}	
		},

		function(next, newAction){
			this.editActionObject
			this.actionToEdit.name = this.editActionObject.name;
			this.actionToEdit.order = this.editActionObject.order;
			this.actionToEdit.filter = this.editActionObject.filter;
			this.actionToEdit.amount = this.editActionObject.amount;
			this.actionToEdit.active = this.editActionObject.active;
		}

	)();
}


ActionController.prototype.startRunActionProcess = function(){

	this.actionToRun = this.view.selectedAction;
	new Run(this,
		function(next){
			this.actionData.run({id:this.actionToRun.id}, next)
		},

		function(next, reply){
			console.log(reply);
		}

	)();
}

