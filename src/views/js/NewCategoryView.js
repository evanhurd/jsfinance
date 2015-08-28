function NewCategoryView(){

	with(QuickStep){
		this.element = new BootStrapModel(
			"Create New Category",
			FormGroup(
				label("Name:"),
				this.nameInput = input({type:'input', class:"form-control"})
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

	return this;
}

NewCategoryView.prototype.destory = function(){
	this.modal.modal('hide');
	return null;
}