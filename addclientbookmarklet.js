(function(){

	var v = "1.9.1";

	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = window.location.protocol + "//ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				initClientBookmarklet();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initClientBookmarklet();
	}
	
	function initClientBookmarklet() {
		(window.clientBookmarklet = function() {
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

			source_url = window.location.href;
			client_name = getSelectionHtml();
			console.log('Selected client name = [' + client_name+ ']');
			console.log('Source url = [' + source_url+ ']');

			function createIFrame(client_name, source_url, reviewer_email) {
				if ($("#wikiframe").length == 0) {
					encoded_client_name = encodeURIComponent(client_name);
					client_form_url = window.location.protocol +  "//rajeevs.github.io/clientsForm.html?num_clients=10&client_name=" + encoded_client_name + "&source_url="+ encodeURIComponent(source_url)\
										+ "&reviwer="+ reviewer_email;
					$("body").append("\
						<div id='wikiframe'>\
							<div id='wikiframe_veil' style=''>\
								<p></p>\
							</div>\
							<iframe src='" + client_form_url + "' onload=\"$('#wikiframe iframe').slideDown(500);\">Enable iFrames.</iframe>\
							<style type='text/css'>\
								#wikiframe_veil { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255,.25); cursor: pointer; z-index: 900; }\
								#wikiframe_veil p { color: black; font: normal normal bold 20px/20px Helvetica, sans-serif; position: absolute; top: 50%; left: 50%; width: 10em; margin: -10px auto 0 -5em; text-align: center; }\
								#wikiframe iframe { display: none; position: fixed; top: 10%; right: 2%; width: 400px; height: 60%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
							</style>\
						</div>");
					$("#wikiframe_veil").fadeIn(750);
					$("#wikiframe #client-form").submit(function(event){
							console.log("Submit clients handler called")
						});
				} else {
					$("#wikiframe_veil").fadeOut(750);
					$("#wikiframe iframe").slideUp(500);
					setTimeout("$('#wikiframe').remove()", 750);
				}

				$("#wikiframe_veil").click(function(event){
					$("#wikiframe_veil").fadeOut(750);
					$("#wikiframe iframe").slideUp(500);
					setTimeout("$('#wikiframe').remove()", 750);
				});
			}

			console.log('Reviewer = ' + window.qudos_bookmarklet_email);
			createIFrame(client_name, source_url, window.qudos_bookmarklet_email);
		})();
	}
})();