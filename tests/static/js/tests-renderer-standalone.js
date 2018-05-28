/* eslint-env browser */
(function () {
    "use strict";
    // Test component to exercise "standalone" client-side renderer.
    //
    //
    /* globals fluid */
    fluid.defaults("gpii.tests.handlebars.renderer.standalone", {
        gradeNames: ["gpii.handlebars.renderer.standalone"],
        templates: {
            layouts: {
                main: "This is content coming from the layout. {{body}}"
            },
            pages: {
                md:        "{{{md .}}}",
                partial:   "This is content coming from the page. {{>includedPartial}}",
                jsonify:   "{{{jsonify . space=0}}}",
                equals:    "{{#equals \"good\" .}}equals{{else}}not equals{{/equals}}"
            },
            partials: {
                includedPartial: "This is content coming from the partial."
            }
        }
    });
})();
