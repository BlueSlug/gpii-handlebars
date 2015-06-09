// Test "template aware" client-side components from within a simulated browser.
//
// The client-side template handling requires a server to provide the template content.
//
// TODO:  Sit down with Antranig to make Zombie components, so that these tests can use the Kettle test infrastructure.
"use strict";
var fluid = fluid || require("infusion");
//fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");
var path  = require("path");

var jqUnit  = fluid.require("jqUnit");
var Browser = require("zombie");

require("gpii-express");

require("../../");
require("./test-router-error");

// Test content (HTML, JS, templates)
var testDir    = path.resolve(__dirname, "..");
var contentDir = path.join(testDir, "static");
var viewDir    = path.join(testDir, "views");

// Dependencies
var bcDir      = path.resolve(__dirname, "../../bower_components");
var modulesDir = path.resolve(__dirname, "../../node_modules");

// Main source to be tested
var srcDir     = path.resolve(__dirname, "../../src");


fluid.registerNamespace("gpii.templates.hb.tests.client.templateFormControl");

gpii.templates.hb.tests.client.templateFormControl.runTests = function (that) {

    jqUnit.module("Testing templateFormControl component...");

    jqUnit.asyncTest("Use Zombie.js to verify the initial form rendering...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
        });
        browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
            // The client side has already manipulated a bunch of stuff by the time we see it, we're just inspecting the results.
            jqUnit.start();

            // Testing the "replaceWith" DOM-manipulation function
            var body = browser.window.$("body");
            jqUnit.assertTrue("The body should contain rendered content that replaces the original source.", body.text().indexOf("This content should not be visible") === -1);
        });
    });

    jqUnit.asyncTest("Use Zombie.js to submit a form that receives a successful AJAX response...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
        });
        browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
            browser.pressButton("Succeed", function () {
                jqUnit.start();
                var successElement = browser.window.$(".readyForSuccess");
                jqUnit.assertTrue("The body should now contain a 'success' message in place of the original text", successElement.text().indexOf("This was a triumph") !== -1);
            });
        });
    });

    jqUnit.asyncTest("Use Zombie.js to submit a form that receives an unsuccessful AJAX response...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
        });
        browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
            browser.pressButton("Fail", function () {
                jqUnit.start();
                var failureElement = browser.window.$(".readyForFailure");
                jqUnit.assertTrue("The body should now contain a 'fail' message in place of the original text", failureElement.text().indexOf("Something has gone horribly wrong as planned.") !== -1);
            });
        });
    });
};

fluid.defaults("gpii.templates.hb.tests.client.templateFormControl", {
    gradeNames: ["gpii.express", "autoInit"],
    config:  {
        "express": {
            "port" :   6995,
            "baseUrl": "http://localhost:6995/",
            "views":   viewDir
        }
    },
    components: {
        inline: {
            type: "gpii.express.hb.inline",
            "options": {
                "path": "/hbs"
            }
        },
        bc: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/bc",
                content: bcDir
            }
        },
        js: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/src",
                content: srcDir
            }
        },
        modules: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/modules",
                content: modulesDir
            }
        },
        content: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/content",
                content: contentDir
            }
        },
        error: {
            type: "gpii.templates.tests.router.error"
        },
        handlebars: {
            type: "gpii.express.hb"
        }
    },
    listeners: {
        "{express}.events.onStarted": {
            funcName: "gpii.templates.hb.tests.client.templateFormControl.runTests",
            args:     ["{that}"]
        }
    }
});

gpii.templates.hb.tests.client.templateFormControl();