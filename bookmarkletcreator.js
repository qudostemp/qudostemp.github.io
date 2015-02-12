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
        if (email){
            var email_code = "window.qudos_bookmarklet_email = '" + email + "';";

        	var markCompanyBookmarkletCode = "if(window.myBookmarklet!==undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src='http://rajeevs.github.io/markcompanybookmarklet.js?';};";
            markCompanyBookmarkletCode += email_code;

            var addClientBookmarkletCode = "if(window.clientBookmarklet!==undefined){clientBookmarklet();}else{document.body.appendChild(document.createElement('script')).src='http://rajeevs.github.io/addclientbookmarklet.js?';};";
            addClientBookmarkletCode += email_code;

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

            $result = $('<div>', {'class': 'bookmarklets-section', 
                                  'id': 'bookmarklets'})
                                .append(createBookMarkletJQueryElements(email, markCompanyBookmarkletCode, 'Mark company bookmarklet'))
                                .append(createBookMarkletJQueryElements(email, addClientBookmarkletCode, 'Add client bookmarklet'));

	    	console.log($result);
	    	if ($(".bookmarklets-section")) {
	    		$(".bookmarklets-section").remove();
	    	}

	    	$("#result-section").append($result);

        } else {
        	alert('Email address is not valid :' + email)
        }
    });
});