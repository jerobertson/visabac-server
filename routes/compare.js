"use strict";

/**
 * Processes requests made to /evaluate - an endpoint for
 * evaluating policies given rules and attributes.
 * 
 * @author James Robertson
 */
module.exports = function(app) {
    var compare = require("../controllers/compare");

    app.route("/compare")
        .post(compare.compare);
};