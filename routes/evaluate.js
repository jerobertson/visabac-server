"use strict";

module.exports = function(app) {
    var evaluate = require("../controllers/evaluate");

    app.route("/evaluate")
        .post(evaluate.evaluate);
};