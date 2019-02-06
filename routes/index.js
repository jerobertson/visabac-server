"use strict";

module.exports = function(app) {
    var index = require("../controllers/index");

    app.route("/")
        .get(index.test_get)
        .post(index.test_post);
};