"use strict";

/**
 * Processes requests made to /evaluate - an endpoint for
 * evaluating policies given rules and attributes.
 * 
 * @author James Robertson
 */
module.exports = function(app) {
    var evaluate = require("../controllers/evaluate");

    app.route("/evaluate")
        .post(evaluate.evaluate);
    app.route("/evaluate/rule/:ruleName")
        .post(evaluate.evaluate);
    app.route("/evaluate/rule/:ruleName/evaluation/:testFor")
        .post(evaluate.evaluate);
};