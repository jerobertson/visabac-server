"use strict";

/**
 * Reads in the request body and parses the policy, attributes and desired evaluation,
 * returning a modified policy that evaluates to the given evaluation.
 * 
 * @author James Robertson
 */
exports.modify = function(req, res) {
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    res.status(501).send("Coming soon!");
}