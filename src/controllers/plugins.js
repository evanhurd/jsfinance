var router = require('../router.js');
var path = require('path');

var jsFiles = [];
var cssFiles = [];

module.exports = {
	registerView : function(file, func){
		var ext = path.extname(file);
		if(ext == '.js'){
			jsFiles.push(file);
		}else if(ext == '.css'){
			cssFiles.push(file);
		}
		router.registerView(file, func);
	}
};

router.register('plugins', 'getJSFileList', getJSFileList);
router.register('plugins', 'getCSSFileList', getCSSFileList);

function getJSFileList(reply){
	reply(jsFiles);
}

function getCSSFileList(reply){
	reply(cssFiles);
}
