function ReportsView(){
	var Q = QuickStep;

	this.categoryId = 0;

	this.window = new WindowView(
		this.list = new ReportsListView(this)
	);
	this.window.title = "Reports";
	this.window.id = "ReportView";
	this.window.active = 1;
	this.activeReport = null;
	this.add = this.list.add;
	return this;
} 


function ReportsListView(reportsView){
	var Q = QuickStep;

	var element = Q.ul({class:'plugin_reports'});
	console.log(reportsView);
	reportsView.reports = {};
	
	element.add = function(reportsView, element, name, func){
	
		var li = Q.li(name);
		element.appendChild(li);
		li.onclick = func;
		li.view = null;
		reportsView.reports[name] = false;
	
		li.onclick = function(reportsView, element, name, func){

			if(reportsView.activeReport){
				reportsView.activeReport.hide();
			}
			
			if(!reportsView.reports[name]){
				reportsView.reports[name]= ReportsReportView(name, new func());
				reportsView.window.body.appendChild(reportsView.reports[name]);
			}

			reportsView.reports[name].show();
			reportsView.activeReport = reportsView.reports[name];

		}.bind(reportsView,reportsView, element, name, func);
		return li;

	}.bind(reportsView, reportsView, element);

	return element;
}

function ReportsReportView(name,reportElement){
	var Q = QuickStep;
	var element = Q.div({style:{display:'none'}},
		Q.h1(name),	
		reportElement
	);
	element.hide = function(){
		this.style.display = 'none';
	};
	element.show = function(){
		this.style.display = 'block';
	};
	return element;
}