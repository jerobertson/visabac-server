"use strict";

exports.test_get = function(req, res) {
    res.json(["GET"]);
}

exports.test_post = function(req, res) {
    res.json(["POST"]);
}