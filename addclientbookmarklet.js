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

			function getUrl(source_url, client_name) {
			    appId = 'AKfycbxtiKPbnT61J6Az2uTPxOCqFxIhUqlwdyj_UQRWT0tvQbPVqjDA';
			    url = 'https://script.google.com/macros/s/' + appId +  '/exec?url=' + source_url + '&client_name=' + client_name + '&reviewer=' + encodeURIComponent('rajeev@qudos.com');
			    return url;
			}

			source_url = window.location.href;
			client_name = getSelectionHtml();
			console.log('Selected client name = [' + client_name+ ']');
			console.log('Source url = [' + source_url+ ']');

			function createIFrame(client_name, source_url) {
				if ($("#wikiframe").length == 0) {
					encoded_client_name = encodeURIComponent(client_name);
					client_form_url = window.location.protocol +  "//rajeevs.github.io/clientsForm.html?num_clients=10&client_name=" + encoded_client_name + "&source_url="+ encodeURIComponent(source_url);
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

			createIFrame(client_name, source_url);
			should_create = false;

			if (client_name != null && client_name != 'undefined' && client_name.length != 0) {
			    if (confirm('Are you sure you want to save this client: <' + client_name +'> to the spreadsheet?'))
			    {
			        should_create = true;
			    }
			    else {
			         console.log('User chose not to add the client :' + client_name);
			    }
			}
			else {
			    var r = confirm("No client selected. Would you like to manually add a client?");
			    if (r == true) {
			       var user_input = prompt("Please enter client name", null);
			       if (user_input != null) {
			          console.log('User picked client_name :' + user_input );
			          client_name = user_input;
			          should_create = true;
			      }  else {
			          console.log('Client name was null');
			      }
			    }
			    else { 
			         console.log('User chose not to add a client explicitly');
			    }
			}

			if (should_create) {
			    console.log('Submitting Source_url :' + source_url + ' client+name ' + client_name);
			    url = getUrl(source_url, client_name);
			    console.log('Submitting a request to URL:' + url);
			    $.ajax({
			      type:'GET',
			      url: url,
			      data: null,
			      dataType: "jsonp"
			    })
			    .done (function (data) {
			       console.log("Call succeeded");
			    })
			    .fail (function ( jqXHR) {
			       console.log("Call failed");
			        });
			}


		})();
	}
})();