(function(){
	function parseQueryStringToDict(){
		var qd = {};
		location.search.substr(1).split("&").forEach(function(item) {var k = item.split("=")[0], v = decodeURIComponent(item.split("=")[1]); qd[k] = v});
		return qd;
	}

	function getQueryStringParameter(name, dict, _default) {
		var val = dict[name];
		if (typeof(val) == 'undefined' || val == 'undefined') {
			if (typeof(_default) !== 'undefined') { 
				return _default ;
			} else {
				return null;
			}
		}
		else {
			return val;
		}
	}

	function getClientFormParameters() {
		queryDict = parseQueryStringToDict();
		// PARAMETERS 
		client_name = getQueryStringParameter('client_name', queryDict);
		num_clients = getQueryStringParameter('num_clients', queryDict, null);
		source_url = getQueryStringParameter('source_url', queryDict);
		reviewer = getQueryStringParameter('reviewer', queryDict);
		sheet_name = getQueryStringParameter('sheet_name', queryDict);

		return {
			client_name: client_name,
			num_clients : num_clients,
			source_url : source_url,
			reviewer : reviewer,
			sheet_name : sheet_name
		}
	}

	function getSelectionHtml() {
	    var html = "";
	    if (typeof window.getSelection != "undefined") {
	        var sel = window.getSelection();
	        if (sel.rangeCount) {
	            var container = document.createElement("div");
	            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
	                container.appendChild(sel.getRangeAt(i).cloneContents());
	            }
	            html = container.innerHTML;
	        }
	    } else if (typeof document.selection != "undefined") {
	        if (document.selection.type == "Text") {
	            html = document.selection.createRange().htmlText;
	        }
	    }
	    return html;
	}

	function getBaseUrl() {
		return 'https://frozen-taiga-8902.herokuapp.com/proxySubmit'; // heroku proxy URL to get around X-domain issues
	}

	function submitClients(payLoad, statusLogger, successFn, errorFn, alwaysFn) {
		if (typeof(payLoad.clients) == 'undefined' && (payLoad.clients == null)) {
	       statusLogger.appendStatus('No clients submitted');
	       return;
		}

	    url = getBaseUrl();
	    console.log('Source_url :' + source_url + ' for reviewer :' + reviewer + ' submitting a request to :' + url);
	    statusLogger.appendStatus('Submitting (' + payLoad.clients.length + ') clients')

	    console.log(payLoad);

	    $.ajax({
		      type:'POST',
		      url: url,
		      data: JSON.stringify(payLoad),
		      dataType: "json",
		      contentType: "application/json; charset=UTF-8"
	    })
	    .done (function (data) {
	    	if( data && data.numClients !== undefined && data.numClients == payLoad.clients.length) {
		       console.log("Call succeeded. Received data: " + data);
		       statusLogger.appendStatus('Saved ' + payLoad.clients.length + ' clients  successfully');
	   		} 
	   		else {
		       console.log("Call failed");
		       var numClientsSaved = 0;

				if (data && data.numClients !== undefined) {
					numClientsSaved = data.numClients;
				}
				statusLogger.appendStatus('Error saving clients: Only ' + data.numClients + ' out of ' + payLoad.clients.length + ' saved');
	   		}
	   		successFn(data);
	    })
	    .fail (function ( jqXHR, textStatus, errorThrown) {
	       console.log("Call failed");
	       var errorMsg = jqXHR.responseText;
	       if(jqXHR.responseText) {
	       		try{
		       		var jsonError = JSON.parse(jqXHR.responseText);
		       		if (jsonError && jsonError.message !== undefined) {
			       		errorMsg = jsonError.message;
			       		errorMsg = 'Error msg is (' + errorMsg + ')'; 
		       		}
		       	}
		       	catch(err) {
		       	}
	       	}

	       	statusLogger.appendStatus('Error saving clients. Not all clients may be in the sheet. \n' + errorMsg);
	       	errorFn(jqXHR, textStatus, errorThrown);
        })
        .always(function(){
			alwaysFn();
        });
	}


	window.parseQueryStringToDict = parseQueryStringToDict;
	window.getQueryStringParameter = getQueryStringParameter;
	window.getClientFormParameters = getClientFormParameters;
	window.qudos_getSelectionHtml = getSelectionHtml;
	window.qudos_submitClients = submitClients;
})();