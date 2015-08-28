function Plugins(cb){
	this.callback = cb;

	new Run(this,

		function(next){
			exec('plugins', 'getJSFileList')
			.done(next)
			.fail(this.callback);			
		},

		function(next, pluginList){
			for(var i = 0; i < pluginList.length; i++){
				addNewJSFile(pluginList[i]);
			}
			next()
		},

		function(){}
	)();


	new Run(this,

		function(next){
			exec('plugins', 'getCSSFileList')
			.done(next)
			.fail(this.callback);			
		},

		function(next, pluginList){
			for(var i = 0; i < pluginList.length; i++){
				addNewCSSFile(pluginList[i]);
			}
			next()
		},

		function(){}
	)();

}

function addNewJSFile(file){
	return QuickStep.script({
		attr:{
			src : file,
			type : 'text/javascript'
		},
		parent : document.head
	});
}

function addNewCSSFile(file){
	return QuickStep.link({
		attr:{
			href : file,
			type : 'text/css',
			rel : 'stylesheet'
		},
		parent : document.head
	});
}