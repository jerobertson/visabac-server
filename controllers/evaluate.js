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
        console.log("Performing an extended evaluation...");
        extended(req, res);
    } else {
        console.log("Performing a simple evaluation...");
        simple(req, res);
    }
}

function simple(req, res) {
    var t0 = new Date().getTime();

    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    var policyString = req.body.policy + "\n" + JSON.stringify(req.body.attributes);

    var policyArray = textParser.parseTextFile(policyString);
    var policyRules = policyParser.parsePolicyRules(policyArray[0]);
    var policyAttributes = JSON.parse(policyArray[1]);
    var policy = new Policy(policyAttributes, policyRules);

    if (req.params.testFor !== undefined) {
        var evaluation = "False";
        if (policy.getPolicy()[req.params.ruleName] == req.params.testFor) evaluation = "True";
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "rule_evaluated": req.params.ruleName, "testing_for": req.params.testFor, "result": evaluation }
    }
    else if (req.params.ruleName !== undefined) {
        var result = { "policy": policyRules, "request_attributes": policyAttributes, "rule_evaluated": req.params.ruleName, "evaluation": policy.getPolicy()[req.params.ruleName]}
    } else {
        var result = { "policy": policyRules, "request_attributes": policyAttributes, "evaluation": policy.getPolicy()}
    }

    result.time_taken = new Date().getTime() - t0;
    console.log(JSON.stringify(result));

    res.json(result);
}

function extended(req, res) {
    var t0 = new Date().getTime();
    
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");
    var attributeParser = require("../functions/parsePolicyAttributes");

    var policyString = req.body.policy + "\n" + JSON.stringify(req.body.attributes);

    var policyArray = textParser.parseTextFile(policyString);
    var policyRules = policyParser.parsePolicyRules(policyArray[0]);
    var policyAttributes = JSON.parse(policyArray[1]);
    var policyFullAttributeList = attributeParser.parsePolicyAttributes(policyRules);

    var hiddenAttributes = policyFullAttributeList.filter(x => !Object.keys(policyAttributes).includes(x) || policyAttributes[x] === "Unknown");

    var Policy = require("../public/classes/Policy").Policy;
    var policy = new Policy(policyAttributes, policyRules);
    var initialEvaluation = policy.getPolicy();

    if (req.params.testFor !== undefined) {
        var evaluations = response_builder_rule(policyAttributes, policyRules, hiddenAttributes, req.params.ruleName, req.params.testFor);
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "hidden_attributes": hiddenAttributes, "rule_evaluated": req.params.ruleName, "testing_for": req.params.testFor, "result": evaluations }
    } else if (req.params.ruleName !== undefined) {
        var evaluations = response_builder_rule(policyAttributes, policyRules, hiddenAttributes, req.params.ruleName);
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "hidden_attributes": hiddenAttributes, "rule_evaluated": req.params.ruleName, "initial_evaluation": initialEvaluation[req.params.ruleName], "extended_evaluations": evaluations }
    } else {
        var evaluations = response_builder(policyAttributes, policyRules, hiddenAttributes);
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "hidden_attributes": hiddenAttributes, "initial_evaluation": initialEvaluation, "extended_evaluations": evaluations}
    }

    result.time_taken = new Date().getTime() - t0;
    console.log(JSON.stringify(result));

    res.json(result);
}

function response_builder(policyAttributes, policyRules, hiddenAttributes) {
    if (hiddenAttributes.length == 0) {
        var Policy = require("../public/classes/Policy").Policy;
        var policy = new Policy(policyAttributes, policyRules);
        return { "request_attributes": JSON.parse(JSON.stringify(policyAttributes)), "evaluation": policy.getPolicy() };
    }

    var evaluations = [];

    var stillHidden = hiddenAttributes.slice();
    var attribute = stillHidden.pop();

    policyAttributes[attribute] = "True";
    evaluations = evaluations.concat(response_builder(policyAttributes, policyRules, stillHidden));

    policyAttributes[attribute] = "False";
    evaluations = evaluations.concat(response_builder(policyAttributes, policyRules, stillHidden));

    return evaluations;
}

function response_builder_rule(policyAttributes, policyRules, hiddenAttributes, rule, requiredEvaluation) {
    if (hiddenAttributes.length == 0) {
        var Policy = require("../public/classes/Policy").Policy;
        var policy = new Policy(policyAttributes, policyRules);
        return [policy.getPolicy()[rule]];
    }

    var evaluations = [];
    var stillHidden = hiddenAttributes.slice();
    var attribute = stillHidden.pop();

    policyAttributes[attribute] = "True";
    var inner_eval = response_builder_rule(policyAttributes, policyRules, stillHidden, rule, requiredEvaluation);
    if (inner_eval === "True") return "True";
    for (var i = 0; i < inner_eval.length; i++) {
        if (inner_eval[i] === requiredEvaluation) return "True";
        if (evaluations.indexOf(inner_eval[i]) === -1) {
            evaluations.push(inner_eval[i]);
            if (evaluations.length === 6) return evaluations;
        }
    }

    policyAttributes[attribute] = "False";
    var inner_eval = response_builder_rule(policyAttributes, policyRules, stillHidden, rule, requiredEvaluation);
    if (inner_eval === "True") return "True";
    for (var i = 0; i < inner_eval.length; i++) {
        if (inner_eval[i] === requiredEvaluation) return "True";
        if (evaluations.indexOf(inner_eval[i]) === -1) {
            evaluations.push(inner_eval[i]);
            if (evaluations.length === 6) return evaluations;
        }
    }

    if (requiredEvaluation !== undefined) return "False";
    return evaluations;
}