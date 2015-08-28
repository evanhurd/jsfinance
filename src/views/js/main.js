$(document).ready(function(){
	window.jsFinance = {
		categories : new CategoryController(),
		getSelectedCateogry : getSelectedCateogry,
		getSelectedMonies : getSelectedMonies,
		clearSelectedMonies : clearSelectedMonies,
		addToolBarButton : addToolBarButton
	};

	function getSelectedCateogry(){
		return window.jsFinance.categories.activeCategory;
	}

	function getSelectedMonies(){
		if(getSelectedCateogry() && getSelectedCateogry().MoneyController){
			return getSelectedCateogry().MoneyController.getSelectedMonies();
		}
		return [];
	}

	function clearSelectedMonies(){
		if(getSelectedCateogry() && getSelectedCateogry().MoneyController){
			return getSelectedCateogry().MoneyController.clearSelectedMonies();
		}
		return false;		
	}

	function addToolBarButton(leftRight, name){
		var button = ToolbarButton(name);
		if( leftRight == 'left'){
			$('.program-window-toolbar-left').append(button);
		}else{
			$('.program-window-toolbar-right').append(button);
		}
		return button;
	}

	new Plugins(function(){});

});
 
function exec(controller, method, data){
	return (function(controller, method, data){
		var req = $.ajax({
		  type: "GET",
		  url: controller+'/'+method,
		  data: data
		}).done(function(res){
			if(res.error) {
				if(req._failCallback)req._failCallback(res);
				return false;
			}
			if(req._doneCallback)req._doneCallback(res);
		}).fail(function(err){
			console.log(arguments);
			if(req._failCallback)req._failCallback(err);
		});


		return {
			req : req,
			done : function(callback){
				req._doneCallback = callback;
				return this;
			},
			fail : function (callback){
				req._failCallback = callback;
				return this;
			}
		}
	})(controller, method, data);
}

function displayMessage(message){
	console.log(message);
}

function isError(obj){
	if(obj.error){
		return true;
	}else{
		return false;
	}
}