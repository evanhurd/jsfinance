 
function ToolbarButton(glyphicon){
	with (QuickStep){
		var buttonElement = div( {class:"program-window-toolbar-button"},
			i({class:"glyphicon glyphicon-" + glyphicon})
		);
	};

	buttonElement.disable = function(){
		this.setAttribute('class', 'program-window-toolbar-button-disabled');
	};

	buttonElement.enable = function(){
		this.setAttribute('class', 'program-window-toolbar-button');
	};

	return buttonElement;
}

QuickStep.FormGroup = function(){
	return QuickStep.div({class:'form-group'}, arguments);
}
