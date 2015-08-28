var Category = new QuickStep.Model('Category', ['id','categoryId', 'name','isOpen', 'children','balance','isActive', '_activate','_parent']);

function CategoryView(){
	var Q = QuickStep;
	this.children = new QuickStep.Collection(Category);

	this.viewChildren = { 1 : this	};
	this.activeCategory = null;

	this.element = Q.div(
		{class:"program-category"},
		this.ul = Q.ul({class:'program-category-children'},
			Q.CollectionElement(this.children, function(category, value){
				return new CategoryViewChild(category, value);
			}.bind(this))
		)
	);

	return this;
}

function CategoryViewChild(category, value){
	var Q = QuickStep;
	category.children = new QuickStep.Collection(Category);
	this.children = category.children;
	this.category = category;

	this.li = Q.li(
		{class:"program-category-child"},
		this.label = Q.div({class:'program-category-label'},
			this.labelIcon = Q.i({
				class:value("isOpen ? 'glyphicon glyphicon-chevron-down' : 'glyphicon glyphicon-chevron-right'")
				, style : {display:"none"}
			}),
			this.labelText = Q.span(value('name')),
			this.labelBalance = Q.span({
				class:value("balance <= 0 ? 'program-category-balance-red' : 'program-category-balance-green'")
			}, "$",value('balance')),
			Q.div({class:value("isActive ? 'program-category-child-arrow-active' : 'program-category-child-arrow-inactive'")},
				Q.i({class:'glyphicon glyphicon-triangle-left'})
			)
		),
		this.children = Q.ul({
				class:value("isOpen ? 'program-category-children isOpen' : 'program-category-children closed'")
			},
			Q.CollectionElement(this.children, function(view, category, value){
				view.labelIcon.style.display = '';
				return new CategoryViewChild(category, value);
			}.bind(this,this))
		)
	);
	
	this.labelIcon.onclick = function(){
		this.category.isOpen = this.category.isOpen ? 0 : 1;
	}.bind(this);

	this.labelText.onclick = function(){
		this.category._activate();
	}.bind(this);

	return this;
}

CategoryView.prototype.toString = function(){return "CategoryView";};
CategoryViewChild.prototype.toString = function(){return "CategoryViewChild";};

CategoryView.prototype.add = function(category){
	if(category.id == 1){
		return this.children.add(category);
	}
	this.viewChildren[category.id] = category;
	if(this.viewChildren[category.categoryId]) {
		this.viewChildren[category.categoryId].children.add(category);
		category._parent = this.viewChildren[category.categoryId];
	}else{
		this.viewChildren[1].children.add(category);
		category._parent = this.viewChildren[1];
	}
};

CategoryView.prototype.remove = function(category){
	if(category.id == 1)return false;
	if(this.viewChildren[category.categoryId]){
		this.viewChildren[category.categoryId].children.remove(category);
	}
};
CategoryViewChild.prototype.add = function(category){	this.children.add(category);	};
CategoryViewChild.prototype.remove = function(category){	this.children.remove(category);	};

QuickStep.on('CategoryView',function(type,thing,target){
	QuickStep.apply(target,thing.element);
	return false;
});

QuickStep.on('CategoryViewChild',function(type,thing,target){
	QuickStep.apply(target,thing.li);
	return false;
});

QuickStep.on('-CategoryViewChild',function(type,thing){
	if(thing.li.parentElement)thing.li.parentElement.removeChild(thing.li);
	return false;
});

QuickStep.on('element<CategoryViewChild',function(type,thing,target){
	if(target.parentElement)target.parentElement.insertBefore(thing.li, target);
	return false;
});