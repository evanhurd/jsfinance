function CategorySelectorView(categorySelector, category){
	var Q = QuickStep;
	this.categorySelector = categorySelector;
	this.element = Q.div({id:'CategorySelector'},
		this.ul = Q.ul()
	);

	new Run(this,

	function(next, category){
		this.loopNext = next;
		next(this, category);
	},

	function(next, view, category){
		for(var i= 0; i < category.children.length;i++){
			var child = new CategorySelectorViewChild(categorySelector, category.children[i]);
			this.loopNext(child, category.children[i]);
			view.ul.appendChild(child.element);
		}
	})(category);

	return this;
}

function CategorySelectorViewChild(categorySelector, category){
	var Q = QuickStep;
	this.element = Q.li({class:'CategorySelector_li'},
		this.label = Q.label(category.name),
		Q.input({type:'checkbox'}),
		this.ul = Q.ul(),
		Q.i({class:'icon-plus glyphicon glyphicon-plus'}),
		Q.i({class:'icon-minus glyphicon glyphicon-minus'})
	);
	this.label.onclick = function(categorySelector, category){
		categorySelector.selectMe(category.id);
	}.bind(categorySelector,categorySelector, category)
	return this;
}