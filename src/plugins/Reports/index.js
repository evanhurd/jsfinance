var Plugins = require('../../controllers/plugins.js');

Plugins.registerView('plugin_Reports.js', function(reply, data){
	reply.file('plugins/Reports/Reports.js');
});

Plugins.registerView('plugin_ReportsView.js', function(reply, data){
	reply.file('plugins/Reports/view.js');
});

Plugins.registerView('D3.js', function(reply, data){
	reply.file('plugins/Reports/d3.v3.min.js');
});