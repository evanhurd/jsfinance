function BootStrapModel(title){
	var id = "BootStrapModel"+BootStrapModel.idCounter++;
	var titleString = arguments[0] || "Untitled";
	arguments[0] = undefined;
	with (QuickStep){
		return div( {class:"modal fade",id:"modal"},
		  div( {class:"modal-dialog"},
		    div( {class:"modal-content"},
		      div( {class:"modal-header"},
		        button( {type:"button", class:"close", attr:{"data-dismiss":"modal", "aria-label":"Close"}},
		        	span({attr:{"aria-hidden":"true"},html:"&times;"})
		        ),
		        h4({class:"modal-title"}, titleString)
		      ),
		      div( {class:"modal-body"}, arguments)
		    )
		  )
		);
	}
}

BootStrapModel.idCounter = 0;