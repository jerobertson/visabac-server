"use strict";

var recurCount = 0; // Honestly, this is just easier than counting recursively. Don't judge me.

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
    recurCount = 0; // See way up at the top of the file. Or don't. Don't is better.

    if (req.query.extended === "true") {
        console.log("Performing an extended evaluation...");
        extended(req, res);
    } else {
        console.log("Performing a simple evaluation...");
        simple(req, res);
    }
}

/**
 * Performs a simple evaluation of a policy.
 * 
 * @param {*} req The request containing details of the policy and its attributes.
 * @param {*} res The response that will contain details of the evaluation.
 */
function simple(req, res) {
    var t0 = new Date().getTime();

    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    // Get the policy and attributes as a string that can be parsed by the VisABAC tool.
    var policyString = req.body.policy + "\n" + JSON.stringify(req.body.attributes);

    // Use VisABAC functions to build objects required to create a Policy object.
    var policyArray = textParser.parseTextFile(policyString);
    var policyRules = policyParser.parsePolicyRules(policyArray[0]);
    var policyAttributes = JSON.parse(policyArray[1]);
    var policy = new Policy(policyAttributes, policyRules);

    if (req.params.testFor !== undefined) {
        // <url>/evaluate/rule/:rule/evaluation/:testFor endpoint.
        // Evaluation is False, unless evaluation matches requirement, then True.
        // Build the result object.
        var evaluation = "False";
        if (policy.getPolicy()[req.params.ruleName] == req.params.testFor) evaluation = "True";
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "rule_evaluated": req.params.ruleName, "testing_for": req.params.testFor, "result": evaluation }
    }
    else if (req.params.ruleName !== undefined) {
        // <url>/evaluate/rule/:rule endpoint.
        // Build the result object.
        var result = { "policy": policyRules, "request_attributes": policyAttributes, "rule_evaluated": req.params.ruleName, "evaluation": policy.getPolicy()[req.params.ruleName]}
    } else {
        // <url>/evaluate endpoint.
        // Build the result object.
        var result = { "policy": policyRules, "request_attributes": policyAttributes, "evaluation": policy.getPolicy()}
    }

    result.debug = {}
    result.debug.time_taken = new Date().getTime() - t0;
    console.log(JSON.stringify(result));

    res.json(result);
}

/**
 * Performs an extended evaluation of a policy.
 * 
 * @param {*} req The request containing details of the policy and its attributes.
 * @param {*} res The response that will contain details of the evaluations.
 */
function extended(req, res) {
    var t0 = new Date().getTime();
    
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");
    var attributeParser = require("../functions/parsePolicyAttributes");

    // Get the policy and attributes as a string that can be parsed by the VisABAC tool.
    var policyString = req.body.policy + "\n" + JSON.stringify(req.body.attributes);
    
    // Use VisABAC functions to build objects required to create a Policy object.
    var policyArray = textParser.parseTextFile(policyString);
    var policyRules = policyParser.parsePolicyRules(policyArray[0]);
    var policyAttributes = JSON.parse(policyArray[1]);
    var policyFullAttributeList = attributeParser.parsePolicyAttributes(policyRules);

    // Get a list of hidden attributes by gathering all of the possible attributes, and selecting those that do not appear
    // in the request.
    // If the length of this is > 10, return a 400 as this will take too long to evaluate.
    // N.B. It can probably be upped to about 15 if you're happy with requests to take a couple of seconds.
    // Your server milage may vary =)
    var hiddenAttributes = policyFullAttributeList.filter(x => !Object.keys(policyAttributes).includes(x) || policyAttributes[x] === "Unknown");
    if (hiddenAttributes.length > 10) {
        res.status(400)
        res.send("Too many hidden attributes!")
        return;
    }

    var Policy = require("../public/classes/Policy").Policy;
    var policy = new Policy(policyAttributes, policyRules);
    var initialEvaluation = policy.getPolicy();

    if (req.params.testFor !== undefined) {
        // <url>/evaluate/rule/:rule/evaluation/:testFor?extended=true endpoint.
        // Get the extended evaluations for the rule and see if it results in to True or False (done inside get_rule_evaluations).
        // Build the result object.
        var evaluations = get_rule_evaluations(policyAttributes, policyRules, hiddenAttributes, req.params.ruleName, req.params.testFor);
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "hidden_attributes": hiddenAttributes, "rule_evaluated": req.params.ruleName, "testing_for": req.params.testFor, "result": evaluations }
    } else if (req.params.ruleName !== undefined) {
        // <url>/evaluate/rule/:rule?extended=true endpoint.
        // Get the extended evaluations for the rule.
        // Build the result object.
        var evaluations = get_rule_evaluations(policyAttributes, policyRules, hiddenAttributes, req.params.ruleName);
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "hidden_attributes": hiddenAttributes, "rule_evaluated": req.params.ruleName, "initial_evaluation": initialEvaluation[req.params.ruleName], "extended_evaluations": evaluations }
    } else {
        // <url>/evaluate?extended=true endpoint.
        // Generate a list of all possible requests and their associated evaluation.
        // Build the result object.
        var evaluations = get_all_evaluations(policyAttributes, policyRules, hiddenAttributes);
        var result = { "policy": policyRules, "request_attributes": JSON.parse(policyArray[1]), "hidden_attributes": hiddenAttributes, "initial_evaluation": initialEvaluation, "extended_evaluations": evaluations}
    }

    result.debug = {}
    result.debug.time_taken = new Date().getTime() - t0;
    result.debug.max_evals = Math.pow(2, hiddenAttributes.length); // Max evals is 2^n request attributes.
    result.debug.eval_count = recurCount; // This is the amount of evaluations that were actually performed.
    console.log(JSON.stringify(result));

    res.json(result);
}

/**
 * Generates all possible request scenarios and returns an object containing all the possible evaluations.
 * 
 * @param {*} policyAttributes The request attributes.
 * @param {*} policyRules The policy's rules.
 * @param {*} hiddenAttributes Attributes relevant to the evaluation, but not found in the request.
 */
function get_all_evaluations(policyAttributes, policyRules, hiddenAttributes) {
    if (hiddenAttributes.length == 0) {
        // If there are no hidden attributes, just evaluate the policy as normal and return the result.
        var Policy = require("../public/classes/Policy").Policy;
        var policy = new Policy(policyAttributes, policyRules);
        recurCount++;
        return { "request_attributes": JSON.parse(JSON.stringify(policyAttributes)), "evaluation": policy.getPolicy() };
    }

    var evaluations = [];
    var stillHidden = hiddenAttributes.slice(); // Create a copy of the hidden attributes (so as not to mess up the recursion).
    var attribute = stillHidden.pop(); // Take the last hidden attribute off the stack.

    // Set the last hidden attribute taken from the stack to True, add it to the policy attributes, and recursively call
    // this function until there are no hidden attributes. Store the evaluations generated.
    policyAttributes[attribute] = "True";
    evaluations = evaluations.concat(get_all_evaluations(policyAttributes, policyRules, stillHidden));

    // Now set the last hidden attribute to True and do the same again. Also store these evaluations.
    policyAttributes[attribute] = "False";
    evaluations = evaluations.concat(get_all_evaluations(policyAttributes, policyRules, stillHidden));

    //And we're done!
    return evaluations;
}

/**
 * Generates all possible request scenarios and returns either a list of all possible decisions for a specific rule,
 * or True/False if a specific rule can evaluate to a required condition.
 * 
 * @param {*} policyAttributes The request attributes.
 * @param {*} policyRules The policy's rules.
 * @param {*} hiddenAttributes Attributes relevant to the evaluation, but not found in the request.
 * @param {*} rule The specific rule to be evaluated.
 * @param {*} requiredEvaluation The required evaluation of the specific rule. Can be undefined if a list of possible evaluations is preferred.
 */
function get_rule_evaluations(policyAttributes, policyRules, hiddenAttributes, rule, requiredEvaluation) {
    if (hiddenAttributes.length == 0) {
        // If there are no hidden attributes, just evaluate the policy as normal and return the result.
        // Specifically, the result of the rule we're specifically looking for.
        var Policy = require("../public/classes/Policy").Policy;
        var policy = new Policy(policyAttributes, policyRules);
        recurCount++;
        return [policy.getPolicy()[rule]];
    }

    var evaluations = [];
    var stillHidden = hiddenAttributes.slice(); // Create a copy of the hidden attributes (so as not to mess up the recursion).
    var attribute = stillHidden.pop(); // Take the last hidden attribute off the stack.

    // Set the last hidden attribute taken from the stack to False, add it to the policy attributes, and recursively call
    // this function until there are no hidden attributes. Store the evaluations generated.
    policyAttributes[attribute] = "False";
    var inner_eval = get_rule_evaluations(policyAttributes, policyRules, stillHidden, rule, requiredEvaluation);
    // If this function simply returns "True", then we should recursively also return "True", because we're done.
    // The wonders of early stopping! (I hate working with functions that return different types.)
    if (inner_eval === "True") return "True";
    if (Array.isArray(inner_eval)) { //Only do this if the returned type was actually an array, and not something like ["F","a","l","s"]...
        for (var i = 0; i < inner_eval.length; i++) {
            if (inner_eval[i] === requiredEvaluation) return "True"; // If we have the required evaluation, just return True.
            if (evaluations.indexOf(inner_eval[i]) === -1) {
                // If we haven't already discovered this result (e.g. Permit is already discovered, so we don't add it to the list a second time),
                // Add it to the list.
                // If this list is of size 4 it contains P,D,NA,I, and as such we can stop early and return (as nothing else can be discovered).
                evaluations.push(inner_eval[i]);
                if (evaluations.length === 4) return evaluations;
            }
        }
    }

    // Now set the last hidden attribute to True and do the same again. Also store these evaluations.
    // Or return things if you don't fancy storing things. Whatever floats your boat.
    // Are my comments getting too sarcastic? I'm at the end of the road here.
    policyAttributes[attribute] = "True";
    var inner_eval = get_rule_evaluations(policyAttributes, policyRules, stillHidden, rule, requiredEvaluation);
    if (inner_eval === "True") return "True";
    if (Array.isArray(inner_eval)) {
        for (var i = 0; i < inner_eval.length; i++) {
            if (inner_eval[i] === requiredEvaluation) return "True";
            if (evaluations.indexOf(inner_eval[i]) === -1) {
                evaluations.push(inner_eval[i]);
                if (evaluations.length === 4) return evaluations;
            }
        }
    }

    // If we've made it this far, we've evaluated all possible scenarios and either haven't found our target evaluation, or
    // The number of evaluations we've found is less than 4.
    // If we've got a target, return False, otherwise simply return all of the evaluations we have found.
    if (requiredEvaluation !== undefined) return "False";
    return evaluations;
}