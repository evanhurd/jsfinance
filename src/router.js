var controllers = {};
var views = {};
var uploaders = {};
var home = false;
var jsFiles = [];
var cssFiles = [];

module.exports = {
	  call : call
	, register : register
	, registerView: registerView
	, callView : callView
	, callHome : callHome
	, setHome : setHome
	, registerUploader : registerUploader
	, callUploader : callUploader
	, registerJS : registerJS
	, registerCSS : registerCSS
	, jsFiles : jsFiles
	, cssFiles : cssFiles
};



function registerJS(name, func){
	if(jsFiles.indexOf[name] < 0){
		jsFiles.push(name);
		registerView(name,func);
	}
}

function registerCSS(name, func){
	if(cssFiles.indexOf[name] < 0){
		cssFiles.push(name);
		registerView(name,func);
	}
}

function registerView(name, func){
	views[name] = func;
}

function registerUploader(name, func){
	uploaders[name] = func;
}

function register(controller, method, func){
	controllers[controller+"_"+method] = func;
}

function call(reply, controller, method, parameters){
	if(controllers[controller+"_"+method]) {
		controllers[controller+"_"+method](reply, parameters);
	}else{
		reply({error:true, message:'Invalid Controller!'});
	}
}

function callView(reply, name, parameters){
	if(views[name]) {
		views[name](reply, parameters);
	}else{
		reply({error:true, message:'404 not found!'});
	}
}

function callUploader(reply, name, request){
	if(uploaders[name]) {
		uploaders[name](reply, request);
	}else{
		reply({error:true, message:'404 not found!'});
	}
}

function callHome(reply, parameters){
	if(home) {
		home(reply, parameters);
	}else{
		reply({error:true, message:'No Home Page Set!'});
	}
}

function setHome(func){
	home = func;
}