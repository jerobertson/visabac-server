"use strict";

/**
     * Extracted from Visualiser.js by David Sanchez, Newcastle University, 2016.
     * Modified by James Robertson, Newcastle University, 2019, to work with Node.js.
     *  
     * This method reads the private _logic variable and create a Javascript object
     * 
     * Example:
     * 
     * Entering this into the interface
     * 
     * R1:Deny if PATIENT_disagrees
     * R2:Permit if OR(HOSPITAL_agrees,SURGEON_agrees)
     * P:DOV(R1, R2)
     * 
     * It should generates the equivalent object
     * 
     * {"R1":"Deny if PATIENT_disagrees","R2":"Permit if OR(HOSPITAL_agrees,SURGEON_agrees)","P":"DOV(R1, R2)"}
     * 
     * @returns {policyRules}
     */
exports.parsePolicyRules = function (_logic) {

    //It creates a new object policyRules to store the rules to be processed
    var policyRules = {};

    if (_logic !== null) {

        //It gets the text from the policy 
        var myPolicy = _logic;

        //It removes spaces and returns from the beginning and the end of the string
        myPolicy = myPolicy.trim();

        //It removes all the return chars and then changes them to tildes
        var myRegex = /\n+/g;
        myPolicy = myPolicy.replace(myRegex, "\n");

        //It splits the expression using the tildes
        var myPolicyArray = myPolicy.split("\n");

        //It takes every element of the policy and splits them by the colons
        for (var i = 0, length = myPolicyArray.length; i < length; i++) {

            //It takes each rule and separates atributes from rules
            var myPolicyRule = myPolicyArray[i];
            var myPolicyRuleArray = myPolicyRule.split(":");

            //It takes the attribute and trims it
            var attribute = myPolicyRuleArray[0];
            attribute = attribute.trim();

            //It takes the rule and trims it
            var rule = myPolicyRuleArray[1];
            rule = rule.trim();

            //It adds the key,value element to the policyRules
            policyRules[attribute] = rule;
        }

        // It patches parser so expressions that are composed by one rule are correctly displayed.
        // It is adding a DOV to perform an idempotent operation.
        // DOV(R1)=R1; since R1 AND R1 = R1
        if (myPolicyArray.length === 1) {

            //It takes the rule and separates atributes from rules
            var myPolicyRule = myPolicyArray[0];
            var myPolicyRuleArray = myPolicyRule.split(":");

            //It takes the attribute and trims it
            var attribute = myPolicyRuleArray[0];
            attribute = attribute.trim();

            //It adds the key,value element to the policyRules
            var bell = String.fromCharCode(7) + String.fromCharCode(7) + String.fromCharCode(7);
            policyRules[bell] = "DOV(" + attribute + ")";

        }

        return policyRules;

    }
};
