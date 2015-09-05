(function(jsf){
	addReportPlugin("Children Debits", ChildrenDebitMoneyReport);
	addNewJSFile('https://www.google.com/jsapi').onload = function(){
		google.load('visualization', '1.0', {'callback':'1;','packages':['corechart','line']});
		google.setOnLoadCallback(function(){});
	};
	
})(jsFinance);



function ChildrenDebitMoneyReport(){
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
        height: 500
      },
      categoryChildren : jsFinance.getSelectedCateogry().children,
      data : []
    },
    function (next) {
      
      this.loopNext = next;
      this.index = 0;
      next();
    },

    function (next){
      var response = arguments[2] || false;
      var name = arguments[1] || '';
      if(response && response[0] && response[0][0]){
        response.name = name;
        this.data.push(response);
      }
      if(this.index < this.categoryChildren.length){
        this.categoryData.getStats(this.categoryChildren[this.index].id, this.loopNext.bind(this, this.categoryChildren[this.index].name));
        this.index++;
      }else{
        next();
      }
    },

    function (next){
      this.dataArrays = [];
      for(var i = 0; i < this.data.length; i++){
        this.dataArrays.push(convertStatsToDataArray(this.data[i]));
      }
      next();
    },

    function(next){
      var data = mergeDataArrays(this.dataArrays);
      console.log(data);
      this.data = google.visualization.arrayToDataTable(data);
      next();        
    },

    function(){
      var chart = new google.visualization.LineChart(element);
      chart.draw(this.data, this.options);
      window.chart = chart;
    }

  )();

	return element;

  function mergeDataArrays(dataArrays){
    var year = {};
    
    var header = ['Year'];
    var dataArray = [header];
    var longestArray = 0;
    for(var i = 0; i < dataArrays.length;i++){
      var dataItem = dataArrays[i];
      var category = dataItem[0][1];
      header.push(category);

      for(var k = 1; k < dataItem.length;k++){
        var my =  dataItem[k][0];
        var debits =  dataItem[k][1];
        if(year[my] == undefined) {
          year[my] = [my];
          dataArray.push(year[my]);
        }
        year[my].push(debits);
        //longestArray = longestArray || year[my].length;
      }
    }
    var len = dataArray[0].length;
    for(var i = 1; i < dataArray.length;i++){
      while(dataArray[i].length < len){
        dataArray[i].push(0);
      }
    }

    return dataArray;
  }

  function convertStatsToDataArray(data){
    var dataArray = [
      ['Year', data.name]
    ];

    var stats = data[0];

    for(var i in stats){
      dataArray.push([
          stats[i].month + '/' + stats[i].year
        , stats[i].debits
      ]);
    }
    return dataArray;
  }

}

