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

	window.parseQueryStringToDict = parseQueryStringToDict;
	window.getQueryStringParameter = getQueryStringParameter;
	window.getClientFormParameters = getClientFormParameters;
	window.qudos_getSelectionHtml = getSelectionHtml;
})();