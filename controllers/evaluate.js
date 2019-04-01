"use strict";

/**
 * Reads in the request body and parses the policy and attributes,
 * returning the policy evaluations.
 * 
 * Takes the following example format:
 * {
 *	"policy": "PX: Deny if BILL_unpaid\nPY: Permit if OR(OWNER_allow, JUDGE_allow)\nPZ: DUP(PX, PY)",
 *	"attributes": {"JUDGE_allow":"Unknown","OWNER_allow":"False","BILL_unpaid":"Unknown"}
 * }
 * 
 * @author James Robertson
 */
exports.evaluate = function(req, res) {
    if (req.query.extended === "true") {
        extended(req, res);
    } else {
        simple(req, res);
    }
}

function simple(req, res) {
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    var policyString = req.body.policy + "\n" + JSON.stringify(req.body.attributes);

    var policyArray = textParser.parseTextFile(policyString);
    var policyRules = policyParser.parsePolicyRules(policyArray[0]);
    var policyAttributes = JSON.parse(policyArray[1]);
    var policy = new Policy(policyAttributes, policyRules);

    console.log("Evaluated policy \"" + policyString.replace(/(?:\r\n|\r|\n)/g, ", ") + "\":");
    console.log(policy.getPolicy());

    var result = { "policy": policyRules, "request_attributes": policyAttributes, "evaluation": policy.getPolicy()}

    res.json(result);
}

function extended(req, res) {
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");
    var attributeParser = require("../functions/parsePolicyAttributes");

    var policyString = req.body.policy + "\n" + JSON.stringify(req.body.attributes);

    var policyArray = textParser.parseTextFile(policyString);
    var policyRules = policyParser.parsePolicyRules(policyArray[0]);
    var policyAttributes = JSON.parse(policyArray[1]);
    var policyFullAttributeList = attributeParser.parsePolicyAttributes(policyRules);

    var hiddenAttributes = policyFullAttributeList.filter(x => !Object.keys(policyAttributes).includes(x) || policyAttributes[x] === "Unknown");

    console.log("The following attributes were hidden from a request: " + hiddenAttributes);
    console.log("Performing an extended evaluation on all permutations of hidden attributes...");

    var Policy = require("../public/classes/Policy").Policy;
    var policy = new Policy(policyAttributes, policyRules);
    var initialEvaluation = policy.getPolicy();

    var evaluations = request_builder(policyAttributes, policyRules, hiddenAttributes);

    console.log(evaluations);

    var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "hidden_attributes": hiddenAttributes, "initial_evaluation": initialEvaluation, "evaluations": evaluations}

    res.json(result);
}

function request_builder(policyAttributes, policyRules, hiddenAttributes) {
    if (hiddenAttributes.length == 0) {
        var Policy = require("../public/classes/Policy").Policy;
        var policy = new Policy(policyAttributes, policyRules);
        return { "request_attributes": JSON.parse(JSON.stringify(policyAttributes)), "evaluation": policy.getPolicy() };
    }

    var evaluations = [];

    var stillHidden = hiddenAttributes.slice();
    var attribute = stillHidden.pop();

    policyAttributes[attribute] = "True";
    evaluations = evaluations.concat(request_builder(policyAttributes, policyRules, stillHidden));

    policyAttributes[attribute] = "False";
    evaluations = evaluations.concat(request_builder(policyAttributes, policyRules, stillHidden));

    return evaluations;
}