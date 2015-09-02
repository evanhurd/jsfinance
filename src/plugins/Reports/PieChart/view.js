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

	var element = Q.ul();
	
	element.add = function(reportsView, element, name, func){
	
		var li = Q.li(name);
		element.appendChild(li);
		li.onclick = func;
		li.view = null;
	
		li.onclick = function(reportsView, element, name, func){

			if(reportsView.activeReport){
				reportsView.activeReport.hide();
			}
			
			if(!element.reportsReportView){
				element.reportsReportView = ReportsReportView(new func());
				reportsView.window.body.appendChild(element.reportsReportView);
			}

			element.reportsReportView.show();
			reportsView.activeReport = element.reportsReportView;

		}.bind(reportsView,reportsView, element, name, func);
		return li;

	}.bind(reportsView, reportsView, element);

	return element;
}

function ReportsReportView(reportElement){
	var Q = QuickStep;
	var element = Q.div({style:{display:'none'}},reportElement);
	element.hide = function(){
		this.style.display = 'none';
	};
	element.show = function(){
		this.style.display = 'block';
	};
	return element;
}