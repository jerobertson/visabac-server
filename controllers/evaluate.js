"use strict";

exports.evaluate = function(req, res) {
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    var policyArray = textParser.parseTextFile(req.body);
    var policyRules = policyParser.parsePolicyRules(policyArray[0]);
    var policyAttributes = JSON.parse(policyArray[1]);
    var policy = new Policy(policyAttributes, policyRules);

    console.log("Evaluated policy \"" + req.body.replace(/(?:\r\n|\r|\n)/g, ", ") + "\":");
    console.log(policy.getPolicy());

    res.json(policy.getPolicy());
}