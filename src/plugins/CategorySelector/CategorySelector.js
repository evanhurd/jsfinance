function CategorySelector(){
	var jsf = window.jsFinance;
	var Q = QuickStep;

	this.view = new CategorySelectorView(this, jsf.categories.categoryView);

	this.modelView = new BootStrapModel('test', this.view.element);
	document.body.appendChild(this.modelView);
	this.modal = $(this.modelView).modal();

	this.selectMe = function(id){
		this.onSelect(id);
		this.onCancel = function(){};
		this.modal.modal('hide');	
	}.bind(this);

	this.onSelect = function(){
		
	};

	this.onCancel = function(){

	};

	this.modal.on('hidden.bs.modal', function (){
		//this.element.parentElement.removeChild(this.element);
		this.view = undefined;
		this.modelView = undefined;
		this.modal = undefined;
		this.onCancel();
	}.bind(this));

}