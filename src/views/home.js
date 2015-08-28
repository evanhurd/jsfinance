var router = require('../router.js');

router.setHome( function(reply, data){
	reply.file('views/html/home.html');
});

router.registerView('quickstep.js', function(reply, data){
	reply.file('views/js/QuickStep.js');
});

router.registerView('main.js', function(reply, data){
	reply.file('views/js/main.js');
});

router.registerView('CategoryView.js', function(reply, data){
	reply.file('views/js/CategoryView.js');
});

router.registerView('MoneyView.js', function(reply, data){
	reply.file('views/js/MoneyView.js');
});

router.registerView('CategoryData.js', function(reply, data){
	reply.file('views/js/CategoryData.js');
});

router.registerView('CategoryController.js', function(reply, data){
	reply.file('views/js/CategoryController.js');
});

router.registerView('Money.js', function(reply, data){
	reply.file('views/js/Money.js');
});

router.registerView('MoneyData.js', function(reply, data){
	reply.file('views/js/MoneyData.js');
});

router.registerView('run.js', function(reply, data){
	reply.file('views/js/run.js');
});

router.registerView('BootStrapModel.js', function(reply, data){
	reply.file('views/js/BootStrapModel.js');
});

router.registerView('MiscElements.js', function(reply, data){
	reply.file('views/js/MiscElements.js');
});

router.registerView('NewCategoryView.js', function(reply, data){
	reply.file('views/js/NewCategoryView.js');
});

router.registerView('EditCategoryView.js', function(reply, data){
	reply.file('views/js/EditCategoryView.js');
});

router.registerView('WindowView.js', function(reply, data){
	reply.file('views/js/WindowView.js');
});

router.registerView('xdate.js', function(reply, data){
	reply.file('views/js/xdate.js');
});

router.registerView('ActionView.js', function(reply, data){
	reply.file('views/js/ActionView.js');
});

router.registerView('ActionController.js', function(reply, data){
	reply.file('views/js/ActionController.js');
});

router.registerView('ActionData.js', function(reply, data){
	reply.file('views/js/ActionData.js');
});

router.registerView('plugins.js', function(reply, data){
	reply.file('views/js/plugins.js');
});

router.registerView('ActionItemEditView.js', function(reply, data){
	reply.file('views/js/ActionItemEditView.js');
});

router.registerView('styles.css', function(reply, data){
	reply.file('views/css/styles.css');
});

router.registerView('form-elements.css', function(reply, data){
	reply.file('views/css/form-elements.css');
});

