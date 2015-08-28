var Plugins = require('../../controllers/plugins.js');

Plugins.registerView('plugin_categorySelector.js', function(reply, data){
	reply.file('plugins/CategorySelector/CategorySelector.js');
});

Plugins.registerView('plugin_categorySelectorView.js', function(reply, data){
	reply.file('plugins/CategorySelector/CategorySelectorView.js');
});

Plugins.registerView('plugin_categorySelectorViewCSS.css', function(reply, data){
	reply.file('plugins/CategorySelector/style.css');
});