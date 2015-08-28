(function(jsf){
	var button = jsf.addToolBarButton('right', 'refresh');
	button.onclick = function(){
		jsf.categories.reload(jsf.getSelectedCateogry());
	};
})(jsFinance);