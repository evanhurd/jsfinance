(function(jsf){
	addNewJSFile('http://localhost:3001/socket.io/socket.io.js').onload = function(){
		window.autoUpdate = new AutoUpdate();
	};
})(jsFinance);

function AutoUpdate(){
	this.socket = io('http://localhost:3001');

	this.socket.on('MODEL_UPDATE', function(msg){
		if(!msg.data){ return false;}

		data = JSON.parse(msg.data);

		if(data.MODEL == 'MONEY'){
			this.updateMoney(data);
		}


	}.bind(this));
	return this;
}

AutoUpdate.prototype.updateMoney = function(data){

	if(data.categoryId && globalMoney[data.old_categoryId]){
		var moneyView = globalMoney[data.old_categoryId].moneyView;
		var money = false;
		
		for(var i =0 ; i < moneyView.Monies.length;i++){
			if(moneyView.Monies[i].id == data.id){
				money = moneyView.Monies[i].Item;
				break;
			}
		}

		if(money){
			if(money.categoryId != data.categoryId){
				moneyView.Monies.remove(money);
				if(globalMoney[data.categoryId]){
					money._active = 0;
					globalMoney[data.categoryId].moneyView.Monies.add(money);
			
				}
			}
			if(data.balance) money.balance = data.balance;
			if(data.credit) money.credit = data.credit;
			if(data.debit) money.debit = data.debit;
			if(data.description) money.description = data.description;
			if(data.categoryId) money.categoryId = data.categoryId;
		}

	}

}