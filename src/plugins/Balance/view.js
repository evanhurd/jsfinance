function BalanceCategoryView(){
	var Q = QuickStep;

	this.selectedCategoryId = 0;

	this.doBalance= function(){

	}

	with(QuickStep){
		this.element = new BootStrapModel(
			"Balance Category",
			FormGroup(
				label("Balance From:"),
				this.fromButton = button({type:"button", class:"btn btn-default btn-xs"}, "Select a Category")
			),
			this.balanceButton = button( {type:"button", class:"btn btn-primary"}, "Balance")
		);	
	}

	document.body.appendChild(this.element);
	this.modal = $(this.element).modal();

	this.modal.on('hidden.bs.modal', function (){
		this.element.parentElement.removeChild(this.element);
		this.element = undefined;
		this.modal = undefined;
	}.bind(this));

	this.balanceButton.onclick = function(){
		if(this.selectedCategoryId == 0){
			return alert("Pleas select a category!");
		};

		this.modal.modal('hide');
		this.doBalance(this.selectedCategoryId);
	}.bind(this);

	this.fromButton.onclick = function(){
		var categorySelector = new CategorySelector();
		categorySelector.onSelect = function(id){
			this.selectedCategoryId = id;
			var categoryName = jsFinance.categories.getNameByCategoryId(id) || 'Unkown';
			this.fromButton.innerHTML = categoryName;
			
		}.bind(this);
	}.bind(this);
} 
