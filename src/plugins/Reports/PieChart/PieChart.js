(function(jsf){
	addReportPlugin("Category Stats", LineCharMoneyReport);
	addNewJSFile('https://www.google.com/jsapi').onload = function(){
		google.load('visualization', '1.0', {'callback':'1;','packages':['corechart','line']});
		google.setOnLoadCallback(function(){});
	};
	
})(jsFinance);



function LineCharMoneyReport(){
	var element = QuickStep.div();

  new Run(
    {
      element: element,
      categoryData : new CategoryData(),
      options : {
        chart: {
          title: 'Box Office Earnings in First Two Weeks of Opening',
          subtitle: 'in millions of dollars (USD)'
        },
        width: 900,
        height: 500,
        colors: ['rgb(51, 102, 204)', 'rgb(18, 220, 55)', 'rgb(220, 55, 18)']
      },
      categoryId : jsFinance.getSelectedCateogry().id
    },
    function (next) {
      this.categoryData.getStats(this.categoryId, next);
    },

    function(next, response){
      if(response[0]){
        this.data = google.visualization.arrayToDataTable(convertStatsToDataArray(response[0]));
        next();        
      }else{
        console.log(response);
      }

    },

    function(){
      var chart = new google.visualization.LineChart(element);
      chart.draw(this.data, this.options);
      window.chart = chart;
    }

  )();

	return element;

  function convertStatsToDataArray(stats){

    var dataArray = [
      ['Month-Year', 'Balance', 'Credits', 'Debits']
    ];

    for(var i in stats){
      dataArray.push([
          stats[i].month + '/' + stats[i].year
        , stats[i].endingBalance
        , stats[i].credits
        , stats[i].debits
      ]);
    }
    console.log(dataArray);
    return dataArray;
  }

}

