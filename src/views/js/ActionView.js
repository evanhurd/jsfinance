var ActionModel = new QuickStep.Model("ActionModel", [
	  'id'
	, 'order'
	, 'categoryId'
	, 'name'
	, 'filter'
	, 'toCategoryId'
	, 'amount'
	, 'active'
	, '_selected'
]);

function ActionView(){
	this.actions = new QuickStep.Collection(ActionModel);

	with(QuickStep){
		this.window = new WindowView(
			"",
			table({class:'program-action-table table table-hover'},
				thead(
					tr(
						  th("Active")
						, th("Order")
						, th("Name")
						, th("Filter")
						, th("Category")
						, th("Amount")
					)
				),
				tbody(
					CollectionElement(this.actions, function(actionView, actionItem, value){
						var tr = ActionViewItem(actionItem, value);
						tr.onclick = function(actionItem){
							this.selectAction(actionItem);
						}.bind(actionView,actionItem);
						return tr;
					}.bind(this, this))
				)
			)
		);
	};

	this.selectAction = ActionView.prototype.selectAction 

	this.$newActionButton = this.window.addSidebarButton('plus-sign');
	this.$editActionButton = this.window.addButton('pencil');
	this.$runActionButton = this.window.addButton('play-circle');
	this.$runAllButton = this.window.addButton('refresh');
	this.$newActionButton.enable();
	this.$runAllButton.enable();
	this.$editActionButton.disable();
	this.$runActionButton.disable();

	this.actions.on('ActionModel._selected', function(event){
		if(this.selectedAction && this.selectedAction._selected == 1){
			this.$editActionButton.enable();
			this.$runActionButton.enable();
		}else{
			this.$editActionButton.disable();
			this.$runActionButton.disable();
		}
	}.bind(this));
	return this;
} 


function ActionViewItem(actionItem, value){
	return QuickStep.tr(
		  {class: value('_selected == 1 ? "program-action-item-selected" : "program-action-item"')}
		, QuickStep.td(value("active == 1 ? 'Yes' : 'No'"))
		, QuickStep.td(value("order"))
		, QuickStep.td(value("name"))
		, QuickStep.td(value("filter"))
		, QuickStep.td(value("toCategoryId"))
		, QuickStep.td(value("amount"))
	);

}

ActionView.prototype.selectAction = function(actionItem){
	if(this.selectedAction && actionItem != this.selectedAction){
		this.selectedAction._selected = 0;
	}
	this.selectedAction = actionItem;
	actionItem._selected = 1;
}