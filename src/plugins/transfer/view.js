function TransferMoneyView(){
	var Q = QuickStep;

	this.selectedCategoryId = 0;

	this.doTransfer = function(){

	}

	with(QuickStep){
		this.element = new BootStrapModel(
			"Transfer Money",
			FormGroup(
				label("To:"),
				this.toButton = button({type:"button", class:"btn btn-default btn-xs"}, "Select a Category")
			),
			this.dangerGroup = FormGroup(
				label("Amount:"),
				this.amountInput = input({type:"input", class:"form-control", value:'0'})
			),
			this.saveButton = button( {type:"button", class:"btn btn-primary"}, "Transfer")
		);	
	}
	document.body.appendChild(this.element);
	this.modal = $(this.element).modal();

	this.saveButton.onclick = function(){
		if(this.selectedCategoryId == 0){
			return alert("Pleas select a category!");
		};

		this.modal.modal('hide');
		this.doTransfer(this.selectedCategoryId , this.amountInput.value);
	}.bind(this);

	this.toButton.onclick = function(){
		var categorySelector = new CategorySelector();
		categorySelector.onSelect = function(id){
			this.selectedCategoryId = id;
			var categoryName = jsFinance.categories.getNameByCategoryId(id) || 'Unkown';
			this.toButton.innerHTML = categoryName;
			
		}.bind(this);
	}.bind(this);

	this.modal.on('hidden.bs.modal', function (){
		this.element.parentElement.removeChild(this.element);
		this.element = undefined;
		this.modal = undefined;
	}.bind(this));

	return this;
}