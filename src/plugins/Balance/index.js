var Plugins = require('../../controllers/plugins.js');

Plugins.registerView('plugin_Balance.js', function(reply, data){
	reply.file('plugins/Balance/Balance.js');
});

Plugins.registerView('plugin_BalanceView.js', function(reply, data){
	reply.file('plugins/Balance/view.js');
});