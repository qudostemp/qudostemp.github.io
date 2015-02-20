$(document).ready(function() {

    function minify(code) {
        // very simple minification (and not overly aggressive on whitespace)
        code = code.split(/\r\n|\r|\n/g);
        var i=0, len=code.length, noSemiColon = {}, t, lastChar;

        $.each('} { ; ,'.split(' '), function(i, x) {
            noSemiColon[x] = 1;
        });

        for (; i<len; i++) {
            // note: this doesn't support multi-line strings with slashes
            t = $.trim(code[i]);

            // this breaks when I put turnaries on multiple lines -- I'll leave it up
            // to the bookmarklet writers to do semi-colons properly
            // if (t) {
            //     // add semi-colon if we should
            //     if (!noSemiColon[t.charAt(t.length-1)]) {
            //         t += ';';
            //     }

            //     // prevent the inadvertently calling a function scenario
            //     if (i!=0 && t && t.substr(0, 1)=='(' && code[i-1].charAt(code[i-1].length-1)!=';') {
            //         t = ';' + t;
            //     }
            // }
            code[i] = t;
        }
        return code.join('').replace(/;$/, '');
    }

    function asBookmarklet(code) {
        code = minify(code);

        code = '(function(){' + code + '})()';
        return 'javascript:' + encodeURIComponent(code);
    }


    //do jQuery stuff when DOM is ready
    $('#bk-form').submit(function(evt) {
        console.log('Handling submit')
        evt.preventDefault();
        var email = $("#user-email").val();
        var sheetName = $("#sheet-name").val();
        var dev_mode = $('#dev-mode-check').prop('checked');
        console.log("Is dev mode : " + dev_mode);

        if (email && sheetName){
            var email_code = "window.qudos_bookmarklet_email = '" + email + "';";
            var sheet_name_code = "window.qudos_bookmarklet_sheetName = '" + sheetName + "';";
            var bookmarklet_mode_code = "window.qudos_bookmarklet_mode = " + dev_mode + ";";

        	var markCompanyBookmarkletCode = "if(window.myBookmarklet!==undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src= window.location.protocol + '//rajeevs.github.io/markcompanybookmarklet.js?';};";
            markCompanyBookmarkletCode += email_code;
            markCompanyBookmarkletCode += sheet_name_code;
            markCompanyBookmarkletCode += bookmarklet_mode_code;

            var addClientBookmarkletCode = "                            \
                function getBookmarkletBaseUrl() {                      \
                    if(window.qudos_bookmarklet_mode = 'DEV') {         \
                        return 'http://localhost:8000';                 \
                    } else {                                            \
                        return window.location.protocol + '//rajeevs.github.io';    \
                    }                                                               \
                }                                                                   \
                                                                                    \
                function getBookmarkletFullUrl(resource) {                          \
                    return getBookmarkletBaseUrl() + resource;                      \
                }                                                                   \
                                                                                    \
                if (window.clientBookmarklet !== undefined) {                       \
                    clientBookmarklet();                                            \
                } else {                                                            \
                    document.body.appendChild(document.createElement('script')).src = getBookmarkletFullUrl('/addclientbookmarklet.js?');   \
                };  \
            ";

            //var addClientBookmarkletCode = "if(window.clientBookmarklet!==undefined){clientBookmarklet();}else{document.body.appendChild(document.createElement('script')).src= window.location.protocol + '//rajeevs.github.io/addclientbookmarklet.js?';};";
            addClientBookmarkletCode += email_code;
            addClientBookmarkletCode += sheet_name_code;
            addClientBookmarkletCode += bookmarklet_mode_code;

        	console.log(markCompanyBookmarkletCode);
            console.log(addClientBookmarkletCode);

        	var $result;
	        if (!$.trim(markCompanyBookmarkletCode) || !$.trim(addClientBookmarkletCode)) {
	            alert('Error generating bookmarklets!');
	            return;
	        }

	        markCompanyBookmarkletCode = asBookmarklet(markCompanyBookmarkletCode, false, false);
	        console.log(markCompanyBookmarkletCode);

            addClientBookmarkletCode = asBookmarklet(addClientBookmarkletCode, false, false);
            console.log(addClientBookmarkletCode);

            function createBookMarkletJQueryElements(email, bookmarkletCode, name){
                return $('<p>', {'html': '<em>Successfully generated bookmarklet!</em>&nbsp; for :' + email + '. Move this '}).append(
                    $('<a/>', {
                        'class': 'bookmarklet',
                        href: bookmarkletCode,
                        text: name
                    })).append(' to the bookmarks bar');
            }

            function getbookmarkletName(base_name, sheetName, dev_mode) {
                var mode_prefix = dev_mode ? '(DEV-MODE) ': '';
                return mode_prefix + base_name + '(' + sheetName + ')';
            }

            $result = $('<div>', {'class': 'bookmarklets-section', 
                                  'id': 'bookmarklets'})
                                .append(createBookMarkletJQueryElements(email, markCompanyBookmarkletCode, 'Mark company bookmarklet'+ '(' + sheetName + ')'))
                                .append(createBookMarkletJQueryElements(email, addClientBookmarkletCode, getbookmarkletName('Add client bookmarklet', sheetName, dev_mode)));

	    	console.log($result);
	    	if ($(".bookmarklets-section")) {
	    		$(".bookmarklets-section").remove();
	    	}

	    	$("#result-section").append($result);

        } else {
            if(!email) {
        	   alert('Email address is not valid :' + email);
            } else {
                if (!sheetName) {
                   alert('SheetName is not valid :' + sheetName);
               }
            }
        }
    });
});