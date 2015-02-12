
(function() {

    /*
    //
    // Code manipulators
    //
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
    
    function asBookmarklet(code, jQueryPath, customPath) {
        code = minify(code);

        if (customPath) {
            code = scriptLoader(code, customPath, false);
        }

        if (jQueryPath) {
            code = scriptLoader(code, jQueryPath, true);
        }

        code = '(function(){' + code + '})()';
        return 'javascript:' + encodeURIComponent(code);
    }

    console.log('Adding a submit handler');

      $("#btn").click( function()
           {
             alert('button clicked');
           }
        );

    $( "#target").submit(function( event ) {
          alert( "Handler for .submit() called." );
          event.preventDefault();
        });

    */

      $("#btn").click( function()
           {
             alert('button clicked');
           }
        );

    /* $('#bk-form').submit(function(evt) {
        console.log('Handling submit')
        evt.preventDefault();
        var email = $("#user-email").val();
        var $code = "if(window.myBookmarklet!==undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src='http://rajeevs.github.io/markcompanybookmarklet.js?'; window.__800_my_email=" + email + "}",
            $wrap = $('#bk-results'),
            jQueryPath = false,
            customPath = false,
            $result;

        if (!$.trim(code)) {
            alert('Please enter some code first, so I can hand craft it as a glorious bookmarklet!');
            return;
        }

        code = asBookmarklet(code, false, false);

        $result = $('<div>', {'class': 'result'}).append(
            $('<p>', {'html': '<em>You did it!</em>&nbsp; You can run your bookmarklet by clicking: '}).append(
                $('<a/>', {
                    'class': 'bookmarklet',
                    href: code,
                    text: 'this link'
                })).append('<br><br>and here is the code:')
        ).append(
            $('<textarea>', {text: code})
        );
    });
    */
}); //.noConflict(true));
