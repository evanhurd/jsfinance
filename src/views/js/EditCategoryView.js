function EditCategoryView(category){
	this.category = category;
	with(QuickStep){
		this.element = new BootStrapModel(
			"Edit Category",
			FormGroup(
				label("Name:"),
				this.nameInput = input({type:'input', class:"form-control", value:category.name})
			),
			this.dangerGroup = FormGroup(
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
			this.onSave(this.nameInput.value);
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

	return this;
}

NewCategoryView.prototype.destory = function(){
	this.modal.modal('hide');
	return null;
}