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

    res.json(policy.getPolicy());
}

function extended(req, res) {
    var textParser = require("../functions/parseTextFile");
    var policyParser = require("../functions/parsePolicyRules");

    var Policy = require("../public/classes/Policy").Policy;

    res.status(501).send("Coming soon!");
}