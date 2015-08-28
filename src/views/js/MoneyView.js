var Money = new QuickStep.Model('Money', ['id','description','debit','credit','createdAt','updatedAt','categoryId','transactionId', 'balance', 'date', '_selected']);

function MoneyView(){
	var Q = QuickStep;
	this.Monies = new QuickStep.Collection(Money);

	this.element = Q.div({
			class:"program-monies",
			style:{display:'none'}
		},
		this.table = Q.table({
				class:'program-monies-table table table-striped'	
			}
			, Q.thead(
				Q.tr(Q.th('#'),Q.th('Date'),Q.th('Description'),Q.th('Debit'),Q.th('Credit'), Q.th('Balance'))
			)
			, this.tbody =  Q.tbody(
				Q.CollectionElement(this.Monies, function(view, money, value){
					return new MoneyViewItem(money, value);
				}.bind(this,this))			
			)
		)
	);
	return this;
}

function MoneyViewItem(money, value){
	var Q = QuickStep;
	var element = Q.tr({
			class:value('_selected == 1 ? "program-monies-money-selected" : ""')
		}
		, Q.td(value('_index+1'))
		, Q.td(value('new XDate(date||"00-00-0000").toString("MM/dd/yyyy")'))
		, Q.td(value('description'))
		, Q.td(value('debit'))
		, Q.td(value('credit'))
		, Q.td(value('balance'))
	);
	element.onclick = function(money){
		if(money._selected == 1){
			money._selected = 0;
		}else{
			money._selected = 1;
		}
	}.bind(money, money);
	return element;
}

MoneyView.prototype.toString = function(){return "MoneyView";}


MoneyView.prototype.add = function(money){
	this.Monies.add(money);
}

MoneyView.prototype.getSelected = function(){
	var selectedMonies = [];
	for(var i = 0; i < this.Monies.length; i++){
		if(this.Monies[i]._selected == 1) selectedMonies.push(this.Monies[i]);
	}
	return selectedMonies;
}

QuickStep.on('MoneyView',function(type,thing,target){
	QuickStep.apply(target,thing.table);
	return false;
});