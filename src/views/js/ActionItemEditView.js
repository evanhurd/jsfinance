function ActionItemEditView(actionItem){
	var actionItem = arguments[0] || {
		  id : 0
		, order : 1
		, name : 'Unititled'
		, filter : ''
		, toCategoryId : 0
		, amount : 0
		, active : 0
	};
	this.actionItem = actionItem;
	var categoryName = actionItem.toCategoryId > 0 ? jsFinance.categories.getNameByCategoryId(actionItem.toCategoryId) : "Select Category";
	this.selectedCategoryId = actionItem.toCategoryId || 0;
	with(QuickStep){
		this.element = new BootStrapModel(
			"Edit Action - [ " + actionItem.name + " ] ",
			FormGroup(
				label("Order:"),
				this.orderInput = input({type:'input', class:"form-control", value:actionItem.order})
			),
			FormGroup(
				label("Name:"),
				this.nameInput = input({type:'input', class:"form-control", value:actionItem.name})
			),
			FormGroup(
				label("Filter:"),
				this.filterInput = input({type:'input', class:"form-control", value:actionItem.filter})
			),
			FormGroup(
				label("Category:"),
				this.toCategoryIdButton = button({type:'input', class:"btn btn-default"}, categoryName)
			),
			FormGroup(
				label("Amount:"),
				this.amountInput = input({type:'input', class:"form-control", value:actionItem.amount})
			),
			FormGroup(
				label(
					this.activeInput = input({type:'checkbox', attr:{
						checked:actionItem.active == 1 ? 'checked' : undefined
					}}),
					"Enabled"
				)
			),
			this.dangerGroup = FormGroup({
					style:{display:actionItem.id > 0 ? "" : "none"}
				},
				this.deleteButton = button({type:"button", class:"btn btn-warning btn-xs"}, "Delete")
			),
			this.dangerGroup = FormGroup(
				{style:{display:'none'}},
				div({class:"NewCategoryView-danger-label"},"Invalid Category Name!")
			),
			this.saveButton = button( {type:"button", class:"btn btn-primary"}, "Save")
		);	
	}
	document.body.appendChild(this.element);
	this.modal = $(this.element).modal();

	this.onSave = function(){};
	this.onCancel = function(){};
	this.onDelete = function(){};

	this.modal.on('hidden.bs.modal', function (){
		this.element.parentElement.removeChild(this.element);
		this.element = undefined;
		this.modal = undefined;
		this.onCancel();
	}.bind(this));

	this.saveButton.onclick = function(){
		if(this.nameInput.value.trim().length > 0){
			this.onSave({
				order : this.orderInput.value
				, name : this.nameInput.value
				, filter : this.filterInput.value
				, toCategoryId : this.selectedCategoryId
				, active : this.activeInput.checked ? 1 : 0
				, amount : this.amountInput.value
			});
			console.log(this.activeInput.checked);
			this.onCancel = function(){};
			this.modal.modal('hide');
		}else{
			this.dangerGroup.style.display = 'block';
		}
	}.bind(this);

	this.deleteButton.onclick = function(){
		this.onDelete();
		this.modal.modal('hide');
	}.bind(this);

	this.toCategoryIdButton.onclick = function(acitonItem){
		var categorySelector = new CategorySelector();
		categorySelector.onSelect = function(id){
			this.selectedCategoryId = id;
			var categoryName = jsFinance.categories.getNameByCategoryId(id) || 'Unkown';
			this.toCategoryIdButton.innerHTML = categoryName;
		}.bind(this);
	}.bind(this);

	return this;
}

ActionItemEditView.prototype.destory = function(){
	this.modal.modal('hide');
	return null;
}