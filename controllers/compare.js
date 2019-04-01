"use strict";

/**
 * Reads in the request body and parses multiple policies and attributes,
 * returning the results of each evaluation to be compared..
 * 
 * @author James Robertson
 */
exports.compare = function(req, res) {
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    var policies = [];
    var policiesRules = [];
    var ruleNames = [];
    
    for (var i = 0; i < req.body.policies.length; i++) {
        var policyString = req.body.policies[i] + "\n" + JSON.stringify(req.body.attributes);
        var policyArray = textParser.parseTextFile(policyString);
        var policyRules = policyParser.parsePolicyRules(policyArray[0]);
        var policyAttributes = JSON.parse(policyArray[1]);
        var policy = new Policy(policyAttributes, policyRules);
        
        policies.push(policy.getPolicy());
        policiesRules.push(JSON.parse(JSON.stringify(policyRules)))

        var ruleKeys = Object.keys(policy.getPolicy());
        for (var j = 0; j < ruleKeys.length; j++) {
            if (ruleNames.indexOf(ruleKeys[j]) === -1) ruleNames.push(ruleKeys[j]);
        }
    }

    var out = {};

    for (var i = 0; i < ruleNames.length; i++) {
        out[ruleNames[i]] = [];
        for (var j = 0; j < policies.length; j++) {
            if (policies[j][ruleNames[i]] !== undefined) {
                out[ruleNames[i]].push(policies[j][ruleNames[i]]);
            } else {
                out[ruleNames[i]].push("Undefined");
            }
        }
    }

    console.log("Comparing policies \"" + JSON.stringify(req.body.policies).replace(/(\\n)/g, ", ") + JSON.stringify(req.body.attributes) + "\":");
    console.log(out);

    var result = {"policies": policiesRules, "attributes": req.body.attributes, "evaluations": out};

    res.json(result);
}