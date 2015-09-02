(function(jsf){
	var button = jsf.addToolBarButton('right', 'usd');
	button.onclick = startOpenReports;

})(jsFinance);

function startOpenReports(){
	var view = new ReportsView();

	
	for(report in __reportPlugins){
		view.add(report, __reportPlugins[report]);
	}

}

__reportPlugins = {};
function addReportPlugin(name, func){
	__reportPlugins[name] = func;
}