var Plugins = require('../../controllers/plugins.js');

Plugins.registerView('transfer_Transfer.js', function(reply, data){
	reply.file('plugins/transfer/transfer.js');
});

Plugins.registerView('transfer_TransferView.js', function(reply, data){
	reply.file('plugins/transfer/view.js');
});
