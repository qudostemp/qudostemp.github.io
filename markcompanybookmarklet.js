(function(){

	var v = "1.3.2";

	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				initMyBookmarklet();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initMyBookmarklet();
	}
	
	function initMyBookmarklet() {
		(window.myBookmarklet = function() {
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

			function getUrl(source_url, answer) {
			    appId = 'AKfycbz6ysLKpqYMzLBPhKaHXqFmS4OSeuf1yXpgUUqjN_xMKWbM0VY';
			    url = 'https://script.google.com/macros/s/' + appId +  '/exec?url=' + source_url + '&answer='+  answer +'&reviewer=Main';
			    return url;
			}

			source_url = window.location.href;
			console.log('Source url = [' + source_url+ ']');

			should_create = true;

			if (should_create) {
			    r = prompt('Enter your response for this company: ', null);
			    if (r !== null) {
			        url = getUrl(source_url, r);
			        console.log('Submitting a request to google apps URL:' + url);
			        $.get( url);
			    }
			}

		})();
	}
})();