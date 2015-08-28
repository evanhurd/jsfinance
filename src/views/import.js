var router = require('../router.js');

router.registerView('import', function(reply, data){
	reply.file('views/html/import.html');
});
 
router.registerView('postimport', function(reply, data){
	reply.file('views/html/postimport.html');
});