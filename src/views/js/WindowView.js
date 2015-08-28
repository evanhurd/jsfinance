var WindowViewModal = new QuickStep.Model('WindowView', [
	  'title'
	, 'active'
	, 'width'
	, 'height'
	, 'zIndex'
]);

function WindowView(){
	var self = new WindowViewModal({
		 title : "Untitled Window"
		, active : 0
		, width: '95%'
		, height: '95%'
		, zIndex : 3
	});

	var sidebarElements = arguments[0] || false;
	var bodyElements = arguments[1] || false;

	var value = new QuickStep.ModelValue(self);
		
	with(QuickStep){
		self.element = div({class:'program-window', style:{
			display: value('active == 1 ? "block" : "none";'),
			width: value('width'),
			height: value('height'),
			zIndex: value('zIndex')
		}},
			div({class:'program-window-header'},
				value('title'),
				self.closeButton = button({type:'button', class:'program-window-close-button btn btn-danger btn-xs'}, "Close")
			),
			div({class:'program-window-toolbar'},
				self.sidebarToolbar = div({class:'program-window-toolbar-left col-md-3'}),
				self.toolbar = div({class:'program-window-toolbar-right col-md-9'})
			),
			div({class:'program-window-area'},
				self.sidebar = div({class:'program-window-sidebar col-md-3'}, sidebarElements),
				self.body = div({class:'program-window-body col-md-9'}, bodyElements)
			)
		);

		self.backdrop = div(
			{class:'program-window-backdrop', style:{
				display: value('active == 1 ? "block" : "none";'),
				zIndex: value('zIndex-1')
			}}
		);
		
	}
	document.body.appendChild(self.backdrop);
	document.body.appendChild(self.element);

	self.remove = function(){
		self.SubPub.destroy();
		self.element.remove();
		self.backdrop.remove();
		self.element = undefined;
		self.backdrop = undefined;
		self.body = undefined;
		self.sidebar = undefined;
		self.sidebarToolbar  = undefined;
		self.toolbar = undefined;
	}
	self.addSidebarButton = WindowView.prototype.addSidebarButton;
	self.addButton = WindowView.prototype.addButton;

	self.closeButton.onclick = function(){
		self.remove();
	}.bind(self);

	return self;
} 


function WindowViewToolbarButton(glyphicon){
	with (QuickStep){
		var buttonElement = div( {class:"program-window-toolbar-button"},
			i({class:"glyphicon glyphicon-" + glyphicon})
		);
	};
	buttonElement.enabled = false;
	buttonElement.disable = function(){
		this.setAttribute('class', 'program-window-toolbar-button-disabled');
		this.enabled = false;
	};

	buttonElement.enable = function(){
		this.setAttribute('class', 'program-window-toolbar-button');
		this.enabled = true;
	};
	buttonElement.onClick = function(callback){
		this.onclick = function(callback){
			if(this.enabled)callback();
		}.bind(buttonElement, callback)
	};
	return buttonElement;
}


WindowView.prototype.addSidebarButton = function(glyphicon){
	var button = WindowViewToolbarButton(glyphicon);
	this.sidebarToolbar.appendChild(button);
	return button;
}


WindowView.prototype.addButton = function(glyphicon){
	var button = WindowViewToolbarButton(glyphicon);
	this.toolbar.appendChild(button);
	return button;
}