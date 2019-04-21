"use strict";

/**
 * This method extracts all of the attributes from a policy/ruleset.
 * 
 * @author James Robertson
 */
exports.parsePolicyAttributes = function(policyRules) {
    var keywords = ["", "Permit", "Deny", "if", "DOV", "POV", "DUP", "PUD", "FA", "OPO", "ODO", "OOA", "OR", "AND"]

    var ruleNames = Object.keys(policyRules);

    keywords = keywords.concat(ruleNames);

    var attributes = [];

    for (var i = 0; i < ruleNames.length; i++) {
        var rule = policyRules[ruleNames[i]];

        var ruleSplit = rule.split(/[ \(\)\,]/); // Split on whitespace, commas, and brackets.

        for (var j = 0; j < ruleSplit.length; j++) {
            // If the word is not already in the list of attributes, and the word is not a keyword, add it in.
            if (attributes.indexOf(ruleSplit[j]) === -1 && keywords.indexOf(ruleSplit[j]) === -1) {
                attributes.push(ruleSplit[j]);
            }
        }
    }

    return attributes;
}