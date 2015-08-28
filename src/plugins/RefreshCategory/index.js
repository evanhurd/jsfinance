var Plugins = require('../../controllers/plugins.js');

Plugins.registerView('plugin_RefreshCategory.js', function(reply, data){
	reply.file('plugins/RefreshCategory/Refresh.js');
});
