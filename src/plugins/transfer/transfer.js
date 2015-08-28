(function(jsf){
	var button = jsf.addToolBarButton('right', 'transfer');
	button.onclick = startNewTransferProcess;

	function startNewTransferProcess(){
		new Run({
				monies : jsf.getSelectedMonies()
			},
			function(next){
				if(this.monies.length > 0) {
					next()
				}else{
					return alert("Please select one or more monies to move!");
				}
			},

			function(next){
				this.view = new TransferMoneyView();
				this.view.doTransfer = next;
			},

			function(next, categoryId, amount){
				this.categoryId = categoryId;
				this.amount = amount;
				this.index = 0;
				this.count = this.monies.length;
				this.loopNext = next;
				next();

			},

			function(next){
				if(this.index < this.count){
					var data = {
						category : this.categoryId,
						money : this.monies[this.index].id,
						amount : this.amount
					};
					exec('MoneyTransfer', 'transfer',data)
					.done(function(money, response){
						this.loopNext();
						updateMoneyInViews(money, response);
					}.bind(this, this.monies[this.index]))
					.fail(function(response){
						console.log(response);
						this.loopNext();
					}.bind(this));
					this.index++;			
				}else{
					next();
				}
			},
			function(){
				console.log('Done!');
			}
		)();
	}

	function updateMoneyInViews(moneyModel, response){
		console.log(moneyModel, response);
	}
})(jsFinance);