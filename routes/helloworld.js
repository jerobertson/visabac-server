"use strict";

/**
 * Processes requests made to /helloworld - an endpoint
 * for producing a simple "hello world" message.
 * 
 * @author James Robertson
 */
module.exports = function(app) {
    var helloworld = require("../controllers/helloworld");

    app.route("/helloworld")
        .get(helloworld.helloworld);
};