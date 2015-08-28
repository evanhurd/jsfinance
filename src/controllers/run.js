function Run(){
	var run = function(functions, runIndex){
		if(runIndex < functions.length) {
			var argsArray = [];
			for(var i = 2; i < arguments.length;i++) {
				argsArray.push(arguments[i]);
			}
			functions[runIndex].apply({},argsArray ); 
			return true;
		}
		return false;
	};

	
	var functions = [];
	var counter = 0;
	for(var i = 1; i < arguments.length;i++) {
		if(typeof arguments[i] == 'function'){
			var func = arguments[i].bind(arguments[0],run.bind(functions,functions, i));
			functions.push(func);
		}
	}
	return run.bind(functions,functions, 0);
} 

module.exports = Run;