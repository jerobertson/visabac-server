"use strict";

/**
 * Processes requests made to /modify - an endpoint for
 * modifying a policy to produce a given evaluation for given attributes.
 * 
 * @author James Robertson
 */
module.exports = function(app) {
    var modify = require("../controllers/modify");

    app.route("/modify")
        .post(modify.modify);
};