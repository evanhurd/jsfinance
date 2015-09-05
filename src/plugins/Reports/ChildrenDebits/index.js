var Plugins = require('../../../controllers/plugins.js');
var router = require('../../../router.js');
var db = require('../../../db.js');

Plugins.registerView('report_ChildrenDebits.js', function(reply, data){
	reply.file('plugins/Reports/ChildrenDebits/chart.js');
});
