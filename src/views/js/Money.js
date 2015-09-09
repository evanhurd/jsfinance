var globalMoney = {};


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
	this.pageIndex = 0;
	this.loadedIndexs = {};
	this.indexHasRecord = true;
	return this;
}

MoneyController.prototype.init = function(){
	this.parent = $('.program-window-body')[0];
	this.moneyView = new MoneyView();
	this.moneyData = new MoneyData();
	this.parent.appendChild(this.moneyView.element);
	this.isInit = true;
	globalMoney[this.category.id] = this;
	this.loadMonies();
	this.moneyView.element.onscroll = this.onScrollEvent.bind(this);
}

MoneyController.prototype.show = function(){
	if(!this.isInit)this.init();
	this.moneyView.element.style.display = 'block';
}

MoneyController.prototype.hide = function(){
	if(this.isInit)this.moneyView.element.style.display = 'none';
}

MoneyController.prototype.onScrollEvent = function(){
	var scrollHeight = this.moneyView.element.scrollHeight - 100 - this.moneyView.element.offsetHeight;
	if(this.moneyView.element.scrollTop >= scrollHeight && this.loadedIndexs[this.pageIndex]){
		this.pageIndex++;
		this.loadMonies();
	}
}

MoneyController.prototype.loadMonies = function(){
	new Run(this,
		function(next){
			var fromIndex = this.pageIndex*100;
			var toIndex =  99;
			this.moneyData.getOrdered({categoryId: this.category.id, fromIndex:fromIndex, toIndex:toIndex}, next)
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
		}else{
			this.loadedIndexs[this.pageIndex] = true;
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