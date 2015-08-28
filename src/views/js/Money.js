function MoneyController(category){
	this.isInit = false;
	this.category = category;
	category.on('isActive', function(category, e){
		if(category.isActive == 1){
			this.show();
		}else{
			this.hide();
		}
	}.bind(this, category));
	return this;
}

MoneyController.prototype.init = function(){
	this.parent = $('.program-window-body')[0];
	this.moneyView = new MoneyView();
	this.moneyData = new MoneyData();
	this.parent.appendChild(this.moneyView.element);
	this.isInit = true;
	this.loadMonies();
}

MoneyController.prototype.show = function(){
	if(!this.isInit)this.init();
	this.moneyView.element.style.display = 'block';
}

MoneyController.prototype.hide = function(){
	if(this.isInit)this.moneyView.element.style.display = 'none';
}

MoneyController.prototype.loadMonies = function(){
	new Run(this,
		function(next){
			this.moneyData.getOrdered({categoryId: this.category.id}, next)
		}, 
		function(next, monies){
			this.populateMonies(monies);
		}
	)();
}

MoneyController.prototype.populateMonies = function(monies){
	var loopData = {
		index : 0,
		monies : monies,
		count : monies.length
	};
	loopData.loopFunc = function(loopData){
		if(loopData.index < loopData.count){
			this.moneyView.Monies.add(new Money(loopData.monies[loopData.index]));	
			loopData.index++;
			setTimeout(loopData.loopFunc, 0);
		}
	}.bind(this,loopData);
	loopData.loopFunc();
	/*for(var i = 0; i < monies.length;i++){
		this.moneyView.Monies.add(new Money(monies[i]));
	}*/
}

MoneyController.prototype.getSelectedMonies = function(){
	return this.moneyView.getSelected();
}

MoneyController.prototype.clearSelectedMonies = function(){
	var monies = this.getSelectedMonies();
	for(var i = 0; i < monies.length;i++){
		monies._selected = 0;
	}
}

MoneyController.prototype.clearAllMonies = function(){
	var monies = this.moneyView.Monies;
	this.moneyView.element.style.display = 'none';
	while(monies.length){
		monies.remove(monies[0]);
	}
	this.moneyView.element.style.display = '';
	return this;
}

MoneyController.prototype.reload = function(){
	this.clearAllMonies();
	this.loadMonies();
}