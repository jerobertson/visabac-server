"use strict";

/**
 * Reads in the request body and parses multiple policies and attributes,
 * returning the results of each evaluation to be compared..
 * 
 * @author James Robertson
 */
exports.compare = function(req, res) {
    console.log("Performing a policy comparison...");

    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    var policies = [];
    var policiesRules = [];
    var ruleNames = [];
    
    // For each policy, parse it, and get its simple evaluation. 
    for (var i = 0; i < req.body.policies.length; i++) {
        // Get the request in to a suitable format for the VisABAC tool, and create a Policy object.
        var policyString = req.body.policies[i] + "\n" + JSON.stringify(req.body.attributes);
        var policyArray = textParser.parseTextFile(policyString);
        var policyRules = policyParser.parsePolicyRules(policyArray[0]);
        var policyAttributes = JSON.parse(policyArray[1]);
        var policy = new Policy(policyAttributes, policyRules);
        
        // Add the policy to the list of parsed policies, and likewise with the rules.
        policies.push(policy.getPolicy());
        policiesRules.push(JSON.parse(JSON.stringify(policyRules)))

        // Get all the names of the rules in the policy and add them to ruleNames (avoiding duplicates).
        var ruleKeys = Object.keys(policy.getPolicy());
        for (var j = 0; j < ruleKeys.length; j++) {
            if (ruleNames.indexOf(ruleKeys[j]) === -1) ruleNames.push(ruleKeys[j]);
        }
    }

    var out = {};

    // Having gathered all of the rule names from all of the policies, build a response object
    // that contains the decisions for each of the rules for each of the policies, inserting
    // "Undefined" when a policy does not have that rule.
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

    var result = {"policies": policiesRules, "attributes": req.body.attributes, "evaluations": out};

    console.log(JSON.stringify(result));

    res.json(result);
}