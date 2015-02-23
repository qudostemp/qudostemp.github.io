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

			function isHtml(text) {
				if(text !== undefined && text) {
					return /<[a-z][\s\S]*>/i.test(text);
				} else {
					return false;
				}
			}

			function getFormBaseUrl() {
				if(window.qudos_bookmarklet_mode) {
					var form_base_url = window.location.protocol +  "//localhost:8000";
				} else {
					var form_base_url = window.location.protocol +  "//rajeevs.github.io"; 
				}
				return form_base_url;
			}

			function getClientForm2Url(client_name, source_url, reviewer_email, sheetName) {
				encoded_client_name = encodeURIComponent(client_name);

				client_form_params = "?num_clients=10&client_name=" + encoded_client_name + "&source_url="+ encodeURIComponent(source_url) + "&reviewer=" + reviewer_email + "&sheet_name=" + encodeURIComponent(sheetName);

				client_form_url = getFormBaseUrl() + "/clientsForm2.html" + client_form_params;

				return client_form_url;
			}

			function getCandidatesFormUrl(selected_text, source_url, reviewer_email, sheetName) {
				form_params = "?source_url="+ encodeURIComponent(source_url) + "&reviewer=" + reviewer_email + "&sheet_name=" + encodeURIComponent(sheetName);

				client_form_url = getFormBaseUrl() + "/candidates.html" + form_params;

				return client_form_url;
			}

			function createIFrame(client_name, source_url, reviewer_email, sheetName) {
				if ($("#wikiframe").length == 0) {
					if(isHtml(selected_text)) {
						url_fn = getCandidatesFormUrl;
					} else {
						url_fn = getClientForm2Url;
					}

					client_form_url = url_fn(selected_text, source_url, reviewer_email, sheetName);


					$("body").append("\
						<div id='wikiframe'>\
							<iframe src='" + client_form_url + "' onload=\"$('#wikiframe iframe').slideDown(500);\">Enable iFrames.</iframe>\
							<style type='text/css'>\
								#wikiframe iframe { display: none; position: fixed; top: 10%; right: 2%; width: 400px; height: 80%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
							</style>\
						</div>");
				} else {
					$("#wikiframe iframe").slideUp(500);
					setTimeout("$('#wikiframe').remove()", 750);
				}
			}

			function createIFrameXDM(selected_html, source_url, reviewer_email, sheetName) {

				if ($("#wikiframe").length == 0) {
					$("body").append("\
							<div id='wikiframe'>\
								<style type='text/css'>\
									#wikiframe iframe { display: none; position: fixed; top: 10%; right: 2%; width: 500px; height: 80%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
								</style>\
							</div>");

					/*
					This commented section is about making the iFrame draggable and resizable (esp. from SW corner). However, there are
					issues due to us using position:fixed which interferes with dragging. This needs some cutom actions on start and stop
					methods of draggable() to fix the position using offset() and .top / .left. 

					$.getScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js')
					  .done(function( script, textStatus ) {
						    console.log( 'JQueryUI loaded : ' + textStatus );
	    		            $("#wikiframe")
				                //.resizable()
				                .draggable({
				                	iframeFix : true,
				                	start: function( event, ui ) { 
				                		//$('#wikiframe iframe').css('position', 'absolute'); 
				                		console.log('Drag started');
				                	},
				                	stop: function( event, ui ) { 
				                		var iFrame = $('#wikiframe iframe');
				                		old_offset = iFrame.offset();
				                		iFrame.css('position', 'fixed'); 
				                		iFrame.offset(old_offset);
				                		console.log('Drag stopped');
				                	}
				                });           
						  })
					  .fail(function( jqxhr, settings, exception ) {
						    console.log( "Triggered ajaxError handler." );
						});
					*/
					
				    var rpc = new easyXDM.Rpc({
				    	local: 'http://localhost:8000' + "/easyxdm_source.html",
				        remote: getCandidatesFormUrl(selected_html, source_url, reviewer_email, sheetName) , //'http://localhost:8000' + '/candidates.html', // the path to the provider
				        container: document.getElementById("wikiframe"),
				        props: {
				            style: {
				            	/*
				            	display: "none",
				            	top : "100px",
				                border: "1px solid red",
				                width: "100px",
				                height: "200px"
								*/
				                position: "fixed",
				                top: "10%",
				                right: "2%",
				                width: "500px", 
				                height: "80%",
				                zindex: "999",
				                border: "10px solid rgba(0,0,0,.5)",
				                margin: "-5px 0 0 -5px"
				            }
		        		}
				    }, 
				    {
				        local: {
				            getParentHtml: function(successFn, errorFn){
				                // here we expose a simple method with no arguments
				                // if we want to return a response, we can use `return ....`,
				                // or we can use the provided callbacks if the operation is async
				                // or an error occurred
				                console.log('getParentHtml called');
				                html = getSelectionHtml();
				                return html;
				            }
				        }
				    });

					$('#wikiframe iframe').load(function(){
						$('#wikiframe iframe').slideDown(500);
					});
				} else {
					$("#wikiframe iframe").slideUp(500);
					setTimeout("$('#wikiframe').remove()", 750);
				}
			}

			function loadEasyXDM(successFn) {
			    var s1, s2, isLoaded = false, xhr, head = document.getElementsByTagName('head')[0];
			 
			    function scriptOnLoad(){
			        if (isLoaded || typeof easyXDM === "undefined" || typeof JSON === "undefined") {
			            return;
			        }
			        isLoaded = true;
			        // here we put the main code, in this case we expose an ajax endpoint
			        successFn();
			    }

			    // load easyXDM
			    s1 = document.createElement("script");
			    s1.type = "text/javascript";
			    s1.src = "https://cdnjs.cloudflare.com/ajax/libs/easyXDM/2.4.17.1/easyXDM.debug.js" ;//"http://provider.com/easyXDM.debug.js";
			    s1.onreadystatechange = function(){
			        if (this.readyState === "complete" || this.readyState === "loaded") {
			            scriptOnLoad();
			        }
			    };
			    s1.onload = scriptOnLoad;
			    head.appendChild(s1);
			    // load JSON if needed
			    if (typeof JSON === "undefined" || !JSON) {
			        s2 = document.createElement("script");
			        s2.type = "text/javascript";
			        s2.src = "https://cdnjs.cloudflare.com/ajax/libs/json2/20140204/json2.js";
			        s2.onreadystatechange = function(){
			            if (this.readyState === "complete" || this.readyState === "loaded") {
			                scriptOnLoad();
			            }
			        };
			        s2.onload = scriptOnLoad;
			        head.appendChild(s2);
			    }
			}

			function handleChildWindow() {
				source_url = window.location.href;
				selected_text = getSelectionHtml();
				console.log('Selected text = [' + selected_text + ']');
				console.log('Source url = [' + source_url+ ']');

				console.log('Reviewer = ' + window.qudos_bookmarklet_email);
				//createIFrame(selected_text, source_url, window.qudos_bookmarklet_email, window.qudos_bookmarklet_sheetName);
				createIFrameXDM(selected_text, source_url, window.qudos_bookmarklet_email, window.qudos_bookmarklet_sheetName);
			}

			function easyXDMLoaded() {
		        return !(typeof easyXDM === "undefined" || typeof JSON === "undefined");
			}

			if(!easyXDMLoaded()) {
				loadEasyXDM(function(){
					console.log('EasyXDM JS loaded');
					handleChildWindow();
				});
			} else {
				handleChildWindow();
			}

		})();
	}
})();