(function(jsf){
	var button = jsf.addToolBarButton('right', 'equalizer');
	button.onclick = startNewBalanceProcess;

	function startNewBalanceProcess(){
		new Run({},
			function(next){
				var view = new BalanceCategoryView();
				view.doBalance = next;
			},

			function(next, fromCategoryId){
				this.fromCategory = fromCategoryId;
				this.category = jsf.getSelectedCateogry().id;
				next();
			},

			function(next){
				BalanceCategoryFromCategory(next, this.category, this.fromCategory);
			},

			function(response){
				console.log(response);
			}
		)();
	}


})(jsFinance);


function BalanceCategoryFromCategory(reply, category, fromCategory){
	exec('BalanceCategory', 'balance',{
		category : category,
		fromCategory : fromCategory
	})
	.done(function(money, response){
		reply(response);
	})
	.fail(function(response){
		console.log(response);
	});	
}