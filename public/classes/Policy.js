/* 
 * 
 * David Sanchez
 * Newcastle University. 2017
 * 
 * Minor modifications made by James Robertson, Newcastle University, 2019 to provide
 * support for both client-side evaluation and server-side evaluation with Node.js.
 * 
 * This is the policy object structure. 
 * 
 * This notation is for object methods:
 * 
 * var resolveRules = function () 
 * 
 * This notation is for internal functions of the object methods:
 * 
 * function resolveRule(rule) 
 * 
 * 
 */




/**
 * A policy is an object with a particular structure
 * 
 * Example:
 * - PA: Permit if attribute1 returns True.
 * - PB: Deny if attribute2 returns True.
 * - PC: DOV(PA, PB)
 * 
 * It would be represented by one object:
 * 
 * id="0"
 * policyAttributeValues= {"attribute1":True,"attribute2":False}
 * policyRules= {"PA": "Permit if attribute1",
 *               "PB": "Deny if attribute2",
 *               "PC": "DOV(PA,PB)"}
 * policyExpression= "DOV(PA,PB)"
 * 
 * @param {type} policyAttributeValues
 * @param {type} policyRules
 * @returns {Policy}
 */
var Policy = function (policyAttributeValues, policyRules) {

//private attributes
    var _policyAttributeValues = policyAttributeValues;
    var _policyRules = policyRules;
    var _policy = {}; //Empty policy object
    var _policyAttributesByRule = {}; //It is used to store only attributes by rule
    var _policyRulesOrCompositions = {}; //It is used to store if an element of the policy is a rule or a composition
    var _policyTreeInJSON = {}; //Policy tree object;

    //===========================================================Private methods
    //==========================================================================

    /**
     *This code iterates through all policy rules (keys) to create an empty set of policy objects.
     *
     * Sample, it takes:
     * 
     * policyRules={"PA": "Permit if attribute1",
     *              "PB": "Deny if attribute2",
     *              "PC": "DOV(PA,PB)"}
     * 
     * And returns its results like this:
     * 
     *        {"PA": "Indeterminate(PD)",
     *         "PB": "Indeterminate(PD)",
     *         "PC": "Indeterminate(PD)"}   
     * 
     * @returns {undefined}
     */
    var init = function () {

        //It initialiss restul to nil
        var result = {};
        //It initialises all policyRules to Indeterminate(PD)
        for (var key in _policyRules) {
            if (_policyRules.hasOwnProperty(key)) {
                var policyName = key;
                var access = "Indeterminate(PD)";
                //It adds the new key with the evaluated condition
                result[policyName] = access;
            }
        }

        //Inits policy with Indeterminate(PermitDeny)
        _policy = result;
        //Updates internal elements of the policy
        update();
    };

    /**
     * This code iterates through all policy rules (keys) to solve the rules (values).
     *
     * Sample, it takes:
     * 
     * policyRules={"PA": "Permit if attribute1",
     *              "PB": "Deny if attribute2",
     *              "PC": "DOV(PA,PB)"}
     * 
     * And modifies results in policy:
     * 
     * _policy={"PA": "Permit",
     *          "PB": "Deny",
     *          "PC": "Permit"}  
     *         
     * And modifies results in _policyAttributesByRule:         
     *    
     * _policyAttributesByRule={"PA": "attribute1",
     *                          "PB": "attribute2",
     *                          "PC": "DOV(PA,PB)"}          
     *                            
     * @returns {undefined}
     */
    var resolveRules = function () {

        for (var key in _policyRules) {
            if (_policyRules.hasOwnProperty(key)) {

                var policyName = key;
                var rule = _policyRules[key];

                //It resolves the attributes by rule
                var attributeByRule = resolveAttributeByRule(rule);
                //It adds the new key with the attributes and logic expression of that rule to an easy to access place
                _policyAttributesByRule[policyName] = attributeByRule;

                //It determines which attributes are rules and which are compositions
                var ruleOrComposition = resolveRuleOrComposition(rule);
                _policyRulesOrCompositions[policyName] = ruleOrComposition;

                //It resolves the rule
                var ruleSolved = resolveRule(rule);
                //It adds the new key with the evaluated condition
                _policy[policyName] = ruleSolved;
            }
        }

        /**
         * This function takes a string expression that represents a rule.
         * Example:
         * 
         * rule: "Permit if NEWCASTLE_student"
         * 
         * Then returns the attribute:
         * NEWCASTLE_student
         * 
         * The purspose is to fill _policAttributesByRule with the values returned
         * by this function so you can have easy access to which attributes are stored by rule
         * 
         * Example:
         * R1: Permit if PATIENT_disagrees
         * 
         * will be stored in __policAttributesByRule as
         * 
         * _policAttributesByRule[R1]=PATIENT_disagrees
         * 
         * @param {type} rule
         * @returns {type|String}
         */
        function resolveAttributeByRule(rule) {

            var result = "";
            var attribute = rule;
            attribute = attribute.replace("Permit if", "");
            attribute = attribute.replace("Deny if", "");
            result = attribute.trim();
            return result;
        }

        /**
         * This function takes a string expression that represents a rule.
         * Example:
         * 
         * 1. R1: "Permit if NEWCASTLE_student"
         *    Returns: rule
         *    Because it is a rule.
         * 
         * 2. P: "DOV(R1,R2)"
         *    Returns: composition
         *    Because it is a composition
         * 
         * The purspose is to fill _policyRulesOrCompositions with the values returned
         * by this function so you can have easy access to which keys store rules or compositions
         * 
         * Example:
         * R1: Permit if PATIENT_disagrees
         * 
         * will be stored in _policyRulesOrCompositions as
         * 
         * _policyRulesOrCompositions[R1]=rule
         * 
         * @param {type} rule
         * @returns {type|String}
         */
        function resolveRuleOrComposition(rule) {

            var result = "";

            if (rule.includes("Permit if") ||
                    rule.includes("Deny if")) {

                result = "rule";

            } else if (rule.includes("DOV") ||
                    rule.includes("POV") ||
                    rule.includes("DUP") ||
                    rule.includes("PUD") ||
                    rule.includes("FA") ||
                    rule.includes("OPO") ||
                    rule.includes("ODO") ||
                    rule.includes("OOA")) {

                result = "composition";
            }

            return result;
        }

        /**
         * This function takes a string expression that represents a rule.
         * Example:
         * 
         * rule: "Permit if NEWCASTLE_student"
         * 
         * The return if condition met would be: Permit"
         * if NEWCASTLE_student=true
         * 
         * @param {type} rule
         * @returns {type|String}
         */
        function resolveRule(rule) {

            var result = "";
            /**
             *It uses this regex to match al words excluding commas, spaces, and expressions between ""
             * An expression "Permit if NEWCASTLE_student would be transformed into:
             * ["Permit","if","NEWCASTLE_student"]
             * @type RegExp
             */
            var myRegex = /[^\s",()]+|"[^"]*"/g;
            var listRule = rule.match(myRegex);
            /**
             * String processing to remove "" from names
             * In case there are names between "", like ""NEWCASTLE Student""  
             * @type .rule@call;match.length
             */
            var top = listRule.length;
            for (var i = 0; i < top; i++) {
                listRule[i] = listRule[i].replace("\"", "");
                listRule[i] = listRule[i].replace("\"", "");
            }

            if (listRule[0] === "Permit" || listRule[0] === "Deny") {

                var effect = listRule[0];
                var attribute = rule;
                attribute = attribute.replace("Permit if", "");
                attribute = attribute.replace("Deny if", "");
                var condition = resolveLogic(attribute);
                var evaluatedCondition = resolveCondition(effect, condition);
                //It returns the evaluated condition
                result = evaluatedCondition;
            } else if (
                    /**
                     * The rule is a composition operation.
                     * Ex: DOV(P1,P2)
                     * It would be evaluated in the if considering the parsing [DOV P1 P2]
                     */
                    listRule[0] === "DOV" ||
                    listRule[0] === "POV" ||
                    listRule[0] === "DUP" ||
                    listRule[0] === "PUD" ||
                    listRule[0] === "FA" ||
                    listRule[0] === "OPO" ||
                    listRule[0] === "ODO" ||
                    listRule[0] === "OOA") {

                //Solves the expression
                var evaluatedComposition = resolveComposition(rule);
                //It returns the evaluated condition
                result = evaluatedComposition;
            }
            return result;

            /**
             * This function takes an effect and a condition that represents a decision.
             * Example:
             * 
             * efect: "Permit": 
             * condition: "True"
             * 
             * If condition met, it returns the effect: "Permit"
             * Otherwise: "NotApplicable", etc..
             * 
             * @param {type} effect
             * @param {type} condition
             * @returns {String}
             */
            function resolveCondition(effect, condition) {

                if (condition === 'True') {
                    return effect;
                } else if (condition === 'False') {
                    return "NotApplicable";
                } else if (condition === 'Unknown' && effect === "Permit") {
                    return "Indeterminate(P)";
                } else if (condition === 'Unknown' && effect === "Deny") {
                    return "Indeterminate(D)";
                } else {
                    return "Indeterminate(PD)";
                }
            }

        }

        /**
         * 
         * This function takes a String representing logic among arguments and 
         * returns the result of the logic expression
         * 
         * Given the following context:
         * 
         * {"JUDGE_allow": "True", "OWNER_allow": "False", "BILL_paid": "Unknown"}
         * 
         * "PY": "Permit if OR(OWNER_allow, JUDGE_allow)",
         *
         * Expression = "OR(OWNER_allow, JUDGE_allow)"
         *
         * returns: "True"  
         *   
         * @param {type} expression
         * @returns {type|Policy._policyAttributeValues|String}
         * 
         */
        function resolveLogic(expression) {

            expression = expression.trim();
            var myRegex = /\(|\,|\)/g; //Select (,) as delimiters.

            var listExpression = expression.split(myRegex).filter(function (el) {
                return el.length !== 0;
            });
            if (listExpression.length === 1) {
                //It is a single attribute. Example: NEWCASTLE_student

                var key = listExpression[0];
                var value = _policyAttributeValues[key];
                return value;
            } else if (listExpression.length === 3) {
                //It is an element. Example: OR(NEWCASTLE_student, BILL_paid)
                var operation = listExpression[0].trim();
                var key1 = listExpression[1];
                var key2 = listExpression[2];
                return evalLogicTwoOperators(operation, key1, key2);
            } else if (listExpression.length > 3) {

                var operation = listExpression[0];
                var key1 = listExpression[1];
                var key2 = resolveLogic(listExpression.slice(2, listExpression.length).toString());
                return evalLogicTwoOperators(operation, key1, key2);
            }


            /**
             * This function takes one operation and two arguments and returns
             *  boolean logic from them
             * 
             * Sample: AND(key1,key2)
             * 
             * operation="AND"
             * key1="True"
             * key2="True"
             * 
             * returns "True"
             * 
             * @param {type} logic
             * @param {type} key1
             * @param {type} key2
             * @returns {String}
             */
            function evalLogicTwoOperators(logic, key1, key2) {

                var value1 = _policyAttributeValues[key1.trim()];
                var value2 = _policyAttributeValues[key2.trim()];
                if (logic === "AND") {
                    //
                    // AND | T | D | U
                    // ---------------
                    //  T  | T | F | U
                    //  F  | F | F | F
                    //  U  | U | F | U
                    //
                    //-------------------   Representation
                    if ((value1 === "True") && (value2 === "True")) {
                        return "True";
                    } else if ((value1 === "False") || (value2 === "False")) {
                        return "False";
                    } else {
                        return "Unknown";
                    }
                } else if (logic === "OR") {

                    //  OR | T | F | U
                    // ---------------
                    //  A  | T | T | T
                    //  F  | T | F | U
                    //  U  | T | U | U
                    //
                    //-   -    -   -    -   Representation
                    if ((value1 === "False") && (value2 === "False")) {
                        return "False";
                    } else if ((value1 === "True") || (value2 === "True")) {
                        return "True";
                    } else {
                        return "Unknown";
                    }

                } else
                    return"Unknown";
            }
        }



    };

    /**
     * 
     * This function takes a composition operation and tries to chop them to
     * process them with resolveLastComposition, and this last one will evaluates them 
     * using evalCompositionOperation
     * 
     * It tries to find expressiones with the following sintax
     * 
     * Example:
     * 
     * Composition: "DOV(R1,R2)"
     * Composition: "DOV(R1,R2,R3)"
     * Composition: "DOV(R1,POV(R2,R3))"
     * Composition: "DOV(POV(R1,R2),R3)"
     * Composition: "DOV(POV(R1,R2),POV(R3,R4))"
     * 
     * Policy: {"R1":"Permit",
     *          "R2":"NotApplicable",
     *          "R3":"NotApplicable",
     *          "R4":"NotApplicable"}
     * 
     * Returns: "Permit" or whatever expression is thrown
     * 
     * Working procedure:
     * 
     * 1. It splits the expression into an array.
     * 2. It tries to walk the array expression placing the elements inside a stack
     * 3. Once it finds a closing parenthesis) it pops all elements of the stack 
     *    saving them in an operators stack, then it pops the last operation.
     *    3.1. Takes the last operation and the operators stack and does resolveLastComposition
     *         3.1.1. resolveLastComposition checks if there are more than 3 operators
     *         3.1.2. It it does it applies recursion.
     *                3.1.2.1. It applies evalCompositionOperation
     * 
     * @param {type} composition
     * @returns {Object}
     */
    var resolveComposition = function (composition) {

        //This stack is used to keep track of the whole stack of operations
        var stack = [];
        //This stack is a provisional stack used only to keep track of elements 
        //once the evaluation of the composition starts to preserve operand's order
        var stackOperands = [];
        //This is uses to store the final result of the evaluation
        var answer;
        //It matches all elements divided by parenthesis and commas, 
        //and includes the parenthesis on the result to keep track of the hierarchy
        var myRegex = /[^\s",()]+|"[^"]*"+|[()]/g;
        var listComposition = composition.match(myRegex);
        //String processing to remove "" from names
        var top = listComposition.length;
        for (var i = 0; i < top; i++) {
            listComposition[i] = listComposition[i].replace("\"", "");
            listComposition[i] = listComposition[i].replace("\"", "");
        }

        //It iterates over all elements of the array
        for (var i = 0; i < top; i++) {

            var element = listComposition[i];
            if (element === ")") {

                //It starts the evaluation process
                while (
                        stack[stack.length - 1] !== "DOV" &&
                        stack[stack.length - 1] !== "POV" &&
                        stack[stack.length - 1] !== "DUP" &&
                        stack[stack.length - 1] !== "PUD" &&
                        stack[stack.length - 1] !== "FA" &&
                        stack[stack.length - 1] !== "OPO" &&
                        stack[stack.length - 1] !== "ODO" &&
                        stack[stack.length - 1] !== "OOA") {

                    //Takes an element from the stack
                    var lastElement = stack.pop();
                    //And places it into the stackElements
                    stackOperands.push(lastElement);
                }

                var lastLogic = stack.pop();
                var lastOperation = resolveLastComposition(lastLogic, stackOperands);
                //It saves the last Operation evaluated on the stack
                stack.push(lastOperation);
            } else if (element !== "(") {

                //Stores the element into the stack
                stack.push(element);
            }
        }
        //It returns the answer
        answer = stack.pop();
        return answer;

        /**
         * This function evaluates the last composition on the stack
         * 
         * @param {type} logic
         * @param {type} operands
         * @returns {Policy._policy|type|String|Policy.result}
         */
        function resolveLastComposition(logic, operands) {
            if (operands.length === 2) {

                var operand1 = operands.pop();
                var operand2 = operands.pop();
                //It saves the result into an array to be consistent
                //var answerArray = [];
                var answer = evalCompositionOperation(logic, operand1, operand2);
                //answerArray.push(answer);

                return answer;
            } else {
                //The operation has more than two elements.
                // For example DOV(R1,R2,R3)
                //It has to be transformed by recursion into DOV[R1,DOV(R2,R3)]

                var operand1 = operands.pop();
                //This is the recursive operation
                var operand2 = resolveLastComposition(logic, operands);
                //Continues the evaluation using the recursive result
                var answer = evalCompositionOperation(logic, operand1, operand2);
                //answerArray.push(answer);

                return answer;
            }
        }

    };

    /**
     * This private method takes a composition with two operands and evaluates it
     * Example:
     * 
     * 1. Composition: "DOV(PA,PB)"
     * 
     *    Policy: {"PA":"Permit",
     *             "PB":"NotApplicable"}
     * 
     * 2. It can also process expressiones of the following format:
     * 
     *    Composition: "DOV(PA,Permit)"
     *    
     *    Policy: {"PA:Permit"}
     * 
     *    This format is used when expresions have been recursively evaluated.
     * 
     * Returns: "Permit" or similar argument
     * 
     * @param {type} logic
     * @param {type} operandKey1
     * @param {type} operandKey2
     * @returns {Policy._policy|String}
     */
    var evalCompositionOperation = function (logic, operandKey1, operandKey2) {

        var operandValue1;
        var operandValue2;
        //Checking if operandKey1 has been resolved previously
        if (
                operandKey1 !== "Permit" &&
                operandKey1 !== "Deny" &&
                operandKey1 !== "NotApplicable" &&
                operandKey1 !== "Indeterminate(P)" &&
                operandKey1 !== "Indeterminate(D)" &&
                operandKey1 !== "Indeterminate(PD)") {

            operandValue1 = _policy[operandKey1];
        } else {
            //It was already resolved
            operandValue1 = operandKey1;
        }

        //Checking if operandKey2 has been resolved previously
        if (
                operandKey2 !== "Permit" &&
                operandKey2 !== "Deny" &&
                operandKey2 !== "NotApplicable" &&
                operandKey2 !== "Indeterminate(P)" &&
                operandKey2 !== "Indeterminate(D)" &&
                operandKey2 !== "Indeterminate(PD)") {

            operandValue2 = _policy[operandKey2];
        } else {
            //It was already resolved
            operandValue2 = operandKey2;
        }





        if (logic === "DOV") {
            //Deny-overrides = AND
            //
            //  DOV  | P    | D | NA   | I(P) | I(D) | I(DP)
            // ---------------------------------------------
            //  P    | P    | D | P    | P    | I(PD)| I(DP)
            //  D    | D    | D | D    | D    | D    | D
            //  NA   | P    | D | NA   | I(P) | I(D) | I(PD)
            //  I(P) | P    | D | I(P) | I(P) | I(PD)| I(PD)
            //  I(D) | I(PD)| D | I(D) | I(PD)| I(D) | I(PD)
            //  I(PD)| I(PD)| D | I(PD)| I(PD)| I(PD)| I(PD)
            //----------------------------------------------   1 Permit (5permits)
            //
            //P
            if ((operandValue1 === "Permit") && (
                    operandValue2 === "Permit" ||
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(P)")) {
                return "Permit";
            } else if ((operandValue1 === "Permit") && (operandValue2 === "Indeterminate(D)")) {
                //===============================================Check this! 
                //Tables differ. Following Charles Morisset convention
                return "Indeterminate(PD)";
            } else if ((operandValue1 === "Permit") && (operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)"; //true 
            }
            //D
            else if ((operandValue1 === "Deny") || (operandValue2 === "Deny")) {
                return "Deny";
            }
            //NA
            else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Permit")) {
                return "Permit";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "NotApplicable")) {
                return "NotApplicable";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Indeterminate(D)")) {
                return "Indeterminate(D)";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //I(P)
            else if ((operandValue1 === "Indeterminate(P)") && (operandValue2 === "Permit")) {
                return "Permit";
            } else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "Indeterminate(D)" ||
                    operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //I(D)
            else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Permit")) {
                //===============================================Check this! 
                //Tables differ. Following Charles Morisset convention
                return "Indeterminate(PD)";
            } else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(D)")) {
                return "Indeterminate(D)";
            } else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Indeterminate(P)" ||
                    operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //I(PD)
            else {
                return "Indeterminate(PD)";
            }

        } else if (logic === "POV") {
            //Permit overrides = OR
            //
            //  POV  | P | D    | NA   | I(P) | I(D) | I(PD)
            // ---------------------------------------------
            //  P    | P | P    | P    | P    | P    | P
            //  D    | D | D    | D    | I(PD | D    | I(PD)
            //  NA   | P | D    | NA   | I(P) | I(D) | I(PD)
            //  I(P) | P | I(PD)| I(P) | I(P) | I(PD)| I(PD)
            //  I(D) | P | D    | I(D) | I(PD)| I(D) | I(PD)
            //  I(PD)| P | I(PD)| I(PD)| I(PD)| I(PD)| I(PD)
            //-------------------------------------------------
            //
            //-   -    -   -    -   5 Permits (10 Permits)
            //
            //P
            if ((operandValue1 === "Permit") || (operandValue2 === "Permit")) {
                return "Permit";
            }
            //D
            else if ((operandValue1 === "Deny") && (
                    operandValue2 === "Deny" ||
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(D)")) {
                return "Deny";
            } else if ((operandValue1 === "Deny") && (operandValue2 === "Indeterminate(P)")) {
                //===============================================Check this! 
                //Tables differ. Following Charles Morisset convention
                return "Indeterminate(PD)";
            } else if ((operandValue1 === "Deny") && (operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //NA
            else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Deny")) {
                return "Deny";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "NotApplicable")) {
                return "NotApplicable";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Indeterminate(D)")) {
                return "Indeterminate(D)";
            } else if ((operandValue1 === "NotApplicable") && (operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //IP(P)
            else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "Deny")) {
                //===============================================Check this! 
                //Tables differ. Following Charles Morisset convention
                return "Indeterminate(PD)";
            }
            //I(D)
            else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Indeterminate(D)")) {
                return "Indeterminate(D)";
            }
            //I(PD)
            else {
                return "Indeterminate(PD)";
            }

        } else if (logic === "DUP") {
            //Deny unless permit
            //
            // DUP   | P | D    | NA   | I(P) | I(D) | I(PD)
            // ---------------------------------------------
            //  P    | P | P    | P    | P    | P    | P
            //  D    | P | D    | D    | D    | D    | D
            //  NA   | P | D    | D    | D    | D    | D
            //  I(P) | P | D    | D    | D    | D    | D
            //  I(D) | P | D    | D    | D    | D    | D
            //  I(PD)| P | D    | D    | D    | D    | D
            //-------------------------------------------------
            //  
            //|   |   |   |   |   | 11 Permits
            //
            if ((operandValue1 === "Permit") || (operandValue2 === "Permit")) {
                return "Permit";
            } else {
                return "Deny";
            }

        } else if (logic === "PUD") {
            //Permit unless deny
            //
            //  PUD  | P | D    | NA   | I(P) | I(D) | I(PD)
            // ---------------------------------------------
            //  P    | P | D    | P    | P    | P    | P
            //  D    | D | D    | D    | D    | D    | D
            //  NA   | P | D    | P    | P    | P    | P
            //  I(P) | P | D    | P    | P    | P    | P
            //  I(D) | P | D    | P    | P    | P    | P
            //  I(PD)| P | D    | P    | P    | P    | P
            //-------------------------------------------------
            //
            //||||||||||||||||||||| 4 Permits (25 permits)
            if ((operandValue1 === "Deny") || (operandValue2 === "Deny")) {
                return "Deny";
            } else {
                return "Permit";
            }

        } else if (logic === "FA") {
            //First applicable.
            //First operand row, second operand column
            //
            //  FA   | P    | D    | NA   | I(P) | I(D) | I(PD)
            // ---------------------------------------------
            //  P    | P    | P    | P    | P    | P    | P
            //  D    | D    | D    | D    | D    | D    | D
            //  NA   | P    | D    | NA   | I(P) | I(D) | I(PD)
            //  I(P) | I(P) | I(P) | I(P) | I(P) | I(P) | I(P)
            //  I(D) | I(D) | I(D) | I(D) | I(D) | I(D) | I(D)
            //  I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)
            //-------------------------------------------------
            //
            //---...---...---...--- 4 Permits (7 permits)
            //
            //P
            if (operandValue1 === "Permit") {
                return "Permit";
            }
            //D
            else if (operandValue1 === "Deny") {
                return "Deny";
            }
            //NA
            else if (operandValue1 === "NotApplicable") {
                return operandValue2;
            }
            //I(P),I(D),I(PD)
            else {
                return operandValue1;
            }

        } else if (logic === "OPO") {
            //Ordered-Permit-overrides.
            //First operand row, second operand column
            //
            //  OPO  | P    | D    | NA   | I(P) | I(D) | I(PD)
            // ---------------------------------------------
            //  P    | P    | P    | P    | P    | P    | P
            //  D    | P    | D    | D    | I(P) | D    | I(PD)
            //  NA   | P    | D    | NA   | I(P) | I(D) | I(PD)
            //  I(P) | P    | I(P) | I(P) | I(P) | I(PD)| I(PD)
            //  I(D) | P    | D    | I(D) | I(PD)| I(D) | I(PD)
            //  I(PD)| P    | I(PD)| I(PD)| I(PD)| I(PD)| I(PD)
            //-------------------------------------------------
            //
            //No line assigned
            //
            //P
            if (operandValue1 === "Permit" || operandValue2 === "Permit") {
                return "Permit";
            }
            //D
            if ((operandValue1 === "Deny") && (
                    operandValue2 === "Deny" ||
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indetermine(D)")) {
                return "Deny";
            } else if ((operandValue1 = "Deny") && (
                    operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if (operandValue1 === "Deny") {
                return "Indeterminate(PD)";
            }
            //NA
            else if (operandValue1 === "NotApplicable") {
                return operandValue2;
            }
            //I(P)
            else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "Permit")) {
                return "Permit";
            } else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "Deny" ||
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if ((operandValue1 === "Indeterminate(P)" && (
                    operandValue2 === "Indeterminate(D)") ||
                    operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //I(D)
            else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Permit")) {
                return "Permit";
            } else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Deny")) {
                return "Deny";
            } else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(D)")) {
                return "Indeterminate(D)";
            } else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Indeterminate(P)" ||
                    operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
                //I(PD)
            } else {
                return "Indeterminate(PD)";
            }

        } else if (logic === "ODO") {
            //Ordered-Deny-overrides.
            //First operand row, second operand column
            //
            //  ODO  | P    | D    | NA   | I(P) | I(D) | I(PD)
            // ---------------------------------------------
            //  P    | P    | D    | P    | P    | I    | I(PD)
            //  D    | D    | D    | D    | D    | D    | D
            //  NA   | P    | D    | NA   | I(P) | I(D) | I(PD)
            //  I(P) | P    | D    | I(P) | I(P) | I(D) | I(D)
            //  I(D) | I    | D    | I(D) | I(D) | I(D) | I(D)
            //  I(PD)| I(PD)| D    | I(PD)| I(PD)| I(PD)| I(PD)
            //-------------------------------------------------
            //
            //No line assigned
            //
            //D
            if (operandValue1 === "Deny" || operandValue2 === "Deny") {
                return "Deny";
            }
            //P
            if ((operandValue1 === "Permit") && (
                    operandValue2 === "Permit" ||
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indetermine(P)")) {
                return "Permit";
            } else if ((operandValue1 = "Permit") && (
                    operandValue2 === "Indeterminate(D)")) {
                return "Indeterminate(PD)";
            } else if (operandValue1 === "Permit") {
                return "Indeterminate(PD)";
            }
            //NA
            else if (operandValue1 === "NotApplicable") {
                return operandValue2;
            }
            //I(P)
            else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "Permit")) {
                return "Permit";
            } else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if ((operandValue1 === "Indeterminate(P)" && (
                    operandValue2 === "Indeterminate(D)") ||
                    operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //I(D)
            else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Permit")) {
                return "Indeterminate(PD)";
            } else if (operandValue1 === "Indeterminate(D)") {
                return "Indeterminate(D)";
            }
            //I(PD)
            else {
                return "Indeterminate(PD)";
            }

        } else if (logic === "OOA") {
            //Only-one applicable.
            //First operand row, second operand column
            //
            //  OOA  | P    | D    | NA   | I(P) | I(D) | I(PD)
            // ---------------------------------------------
            //  P    | I    | I    | P    | I(P) | I(D) | I(PD)
            //  D    | I    | I    | D    | I(P) | I(D) | I(PD)
            //  NA   | P    | D    | NA   | I(P) | I(D) | I(PD)
            //  I(P) | I(P) | I(P) | I(P) | I(P) | I(PD)| I(PD)
            //  I(D) | I(D) | I(D) | I(D) | I(PD)| I(D) | I(PD)
            //  I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)
            //-------------------------------------------------
            //
            //---.---.---.---.---   2 Permits
            //P
            if ((operandValue1 === "Permit") && (operandValue2 === "NotApplicable")) {
                return "Permit";
            } else if ((operandValue1 === "Permit") && (
                    operandValue2 === "Permit" ||
                    operandValue2 === "Deny")) {
                return "Indeterminate(PD)";
            } else if (operandValue1 === "Permit") {
                return operandValue2;
            }
            //D
            if ((operandValue1 === "Deny") && (operandValue2 === "NotApplicable")) {
                return "Deny";
            } else if ((operandValue1 === "Deny") && (
                    operandValue2 === "Permit" ||
                    operandValue2 === "Deny")) {
                return "Indeterminate(PD)";
            } else if (operandValue1 === "Deny") {
                return operandValue2;
            }
            //NA,
            else if (operandValue1 === "NotApplicable") {
                return operandValue2;
            }
            //I(P)
            else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "Permit" ||
                    operandValue2 === "Deny" ||
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(P)")) {
                return "Indeterminate(P)";
            } else if ((operandValue1 === "Indeterminate(P)") && (
                    operandValue2 === "Indeterminate(D)" ||
                    operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //I(D)
            else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Permit" ||
                    operandValue2 === "Deny" ||
                    operandValue2 === "NotApplicable" ||
                    operandValue2 === "Indeterminate(D)")) {
                return "Indeterminate(D)";
            } else if ((operandValue1 === "Indeterminate(D)") && (
                    operandValue2 === "Indeterminate(P)" ||
                    operandValue2 === "Indeterminate(PD)")) {
                return "Indeterminate(PD)";
            }
            //I(DP)
            else {
                return "Indeterminate(PD)";
            }
        }
    };

    /**
     * This procedure takes the last policy rule (The composition operation)
     * and creates a tree by evaluating it
     * 
     * @returns {Node}
     */
    var parsePolicyToTree = function () {

        var root = {};
        var policyRulesKeysArray = Object.keys(_policyRules);
        try {

            //Get the last key which corressponds to the policy entry point
            var key = policyRulesKeysArray[policyRulesKeysArray.length - 1];
            var policyEntryPoint = _policyRules[key];

            //Calls the procedure that parses the whole policy into a tree
            var root = parseCompositionToTree(key, policyEntryPoint);

            if (key === 'undefined')
                throw "Undefined Key Elements";
            if (policyEntryPoint === 'undefined')
                throw "Undefined Value Elements";
        } catch (err) {

            //Provide user feedback with the kind of problem mistyped
            if (typeof alert !== 'undefined') alert(err);
            else console.log(err);
        }

        return root;
    };

    /**
     * 
     * This method takes a composition operation and tries to chop them to
     * process them with resolveLastComposition, and this last one will evaluates them 
     * using evalCompositionOperation.
     * 
     * The PolicyKey is preserved to determine exactly in wich composition policy the algorithm is working.
     * 
     * The main difference with resolveComposition is that it creates a tree
     * in the process and instead of returning an evaluation, it returns a full
     * data structure.
     * 
     * It tries to find compositions with the following sintax
     * 
     * Example:
     * 
     * policyID: P
     * 
     * Composition: "DOV(R1,R2)"
     * Composition: "DOV(R1,R2,R3)"
     * Composition: "DOV(R1,POV(R2,R3))"
     * Composition: "DOV(POV(R1,R2),R3)"
     * Composition: "DOV(POV(R1,R2),POV(R3,R4))"
     * 
     * Policy: {"R1":"Permit",
     *          "R2":"NotApplicable",
     *          "R3":"NotApplicable",
     *          "R4":"NotApplicable"}
     * 
     *  Returns a structure similar to this: 
     * ---------
     * | DOV[P]|
     * | P     |
     * | root  |
     * | rate  |
     * | value |
     * ---------
     *     |      |--------|
     *     +------|R1      |
     *     |      |rate    |
     *     |      |value   |
     *     |      |--------| 
     *     |      |--------|
     *     +------|POV     |
     *            |P       |
     *            |rate    |
     *            |value   |
     *            |--------| 
     *                |      |--------|
     *                +------|R2      |
     *                |      |rate    |
     *                |      |value   |
     *                |      |--------| 
     *                |      |--------|
     *                +------|R3      |
     *                       |rate    |
     *                       |value   |
     *                       |--------| 
     *            
     * Spaces, parenthesis and commans are used to separete policy components
     * 
     * Working procedure:
     * 
     * 1. It splits the expression into an array.
     * 2. It tries to walk the array expression placing the elements inside a stack
     * 3. Once it finds a closing parenthesis) it pops all elements of the stack 
     *    saving them in an operators stack, then it pops the last operation.
     *    3.1. Takes the last operation and the operators stack and does resolveLastComposition
     *         3.1.1. resolveLastComposition checks if there are more than 3 operators
     *         3.1.2. It it does it applies recursion.
     *                3.1.2.1. It applies evalCompositionOperation
     * @param {type} policyID
     * @param {type} composition
     * @returns {Array|type}
     */
    var parseCompositionToTree = function (policyID, composition) {
        //If we can't find the Node class, we're on the server and can skip this bit.
        if (typeof Node === 'undefined') return;

        //This stack is used to keep track of the whole stack of operations
        var stack = [];
        //This stack is a provisional stack used only to keep track of elements 
        //once the evaluation of the composition starts to preserve operand's order
        var stackOperands = [];
        //This is uses to store de final result of the evaluation
        var answer;
        //It matches all elements divided by parenthesis and commas, 
        //and includes the parenthesis on the result to keep track of the hierarchy
        var myRegex = /[^\s",()]+|"[^"]*"+|[()]/g;
        var listComposition = composition.match(myRegex);
        //String processing to remove "" from names
        var top = listComposition.length;
        for (var i = 0; i < top; i++) {
            listComposition[i] = listComposition[i].replace("\"", "");
            listComposition[i] = listComposition[i].replace("\"", "");
        }

        //It iterates over all elements of the array
        for (var i = 0; i < top; i++) {

            var element = listComposition[i];
            if (element === ")") {

                //It starts the evaluation process
                while ((stack[stack.length - 1].name !== "DOV" &&
                        stack[stack.length - 1].name !== "POV" &&
                        stack[stack.length - 1].name !== "DUP" &&
                        stack[stack.length - 1].name !== "PUD" &&
                        stack[stack.length - 1].name !== "FA" &&
                        stack[stack.length - 1].name !== "OPO" &&
                        stack[stack.length - 1].name !== "ODO" &&
                        stack[stack.length - 1].name !== "OOA") ||
                        stack[stack.length - 1].access !== "") {

                    //Takes an element from the stack
                    var lastElement = stack.pop();
                    //And places it into the stackElements
                    stackOperands.push(lastElement);
                }

                var lastLogic = stack.pop();
                var lastOperation = parseLastComposition(policyID, lastLogic, stackOperands);
                //It saves the last Operation evaluated on the stack
                stack.push(lastOperation);
            } else if (element !== "(") {

                //Stores the element into the stack using a node
                var node = new Node("", "", element);   
                stack.push(node);
            }
        }
        //It returns the answer
        answer = stack.pop();

        //This method removes unnecessary composition operators that may clutter the visualisation
        var cleanerAnswer = removeUnneededCompositionOperators(answer);

        return cleanerAnswer;

        /**
         * This function evaluates the last composition on the stack
         * 
         * Given: 
         * 
         * policy ID:P
         * Logic:POV
         * operands:[R2,R3]
         * 
         * Returns a structure similar to this: 
         * ---------
         * | POV   |
         * | P     |
         * | root  |
         * | rate  |
         * | value |
         * ---------
         *     |      |--------|
         *     +------|R2      |
         *     |      |rate    |
         *     |      |value   |
         *     |      |--------| 
         *     |      |--------|
         *     +------|R3      |
         *            |rate    |
         *            |value   |
         *            |--------| 
         * 
         * @param {type} policyID
         * @param {type} logic
         * @param {type} operands
         * @returns {unresolved}
         */
        function parseLastComposition(policyID, logic, operands) {

            /**
             * First, a check for all operands and recursive calls to parseCompositionTree
             * This ensures that polices with composition operations by referece get resolved.
             * Ex. 
             * 
             * PA: Permit if AND(SAFETY_check, OPERATIONS_check
             * PB: Deny if ENGINEERING_uncheck
             * PC: Permit if HQ_check
             * PD: DUP(PA,PB)
             * PE: DOV(PD,PC,PD,FA(PB,PC))
             * 
             * This first part of the code resolves PD recursively
             *   
             * @type Number
             */
            for (var i = 0, top = operands.length; i < top; i++) {

                //It copies the operand to ease syntax
                var operand = operands[i];

                if (_policyRulesOrCompositions[operand.name] === "composition") {
                    //If the operand is a composition, it has to recursively solve that composition
                    //calling to this procedure with the operand
                    var myOperand = parseCompositionToTree(operand.name, _policyAttributesByRule[operand.name]);

                    //It saves the changes inside the array
                    operands[i] = myOperand;


                } else if (_policyRulesOrCompositions[operand.name] === "rule" &&
                        operand.access === "") {
                    //The operand has not been resolved before
                    //Getting key names
                    var operandKey = operand.name;
                    //It saves the values of the operators
                    var operandValue = _policy[operandKey];

                    //It stores the policy ID to which this logic node belongs to
                    operand.policyID = policyID;
                    //It saves the operandValue as a string, like Permit, Deny...
                    operand.access = operandValue;
                    //It also saves the operandValue as the equivalent number
                    operand.rate = policyAccessInNumber(operandValue);
                    //It resolves rules attributes
                    var attribute = _policyAttributesByRule[operandKey];
                    if (attribute !== undefined) {
                        //Stores the element into the stack using a node
                        var node = new Node("", "", attribute);
                        node.attribute = true;
                        node.policyID = policyID;
                        operand.children.push(node);
                    }
                }
            }

            /**
             * Second, resolution and recursive calls to parseLasComposition
             * This ensures that polices with long lists of composition operations get resolved.
             * Ex. 
             * 
             * PA: Permit if AND(SAFETY_check, OPERATIONS_check
             * PB: Deny if ENGINEERING_uncheck
             * PC: Permit if HQ_check
             * PD: DUP(PA,PB)
             * PE: DOV(PD,PC,PD,FA(PB,PC))
             * 
             * This second part of the code resolves PD,PC,PD... recursively
             * creating intermidiates nodes (branches in the tree) since composition operationss 
             * can only be applied to pairs.
             *   
             * @type Number
             */
            if (operands.length === 2) {

                //Getting operands
                var operand1 = operands.pop();
                var operand2 = operands.pop();

                //Getting logic inside name
                var myLogic = logic.name;

                //Getting the result of the logic applied to operands
                var answer = evalCompositionOperation(myLogic, operand1.access, operand2.access);

                //It saves the answer into the operation
                logic.logic = logic.name;
                //It stores the policy ID to which this logic node belongs to
                logic.policyID = policyID;
                logic.access = answer;
                logic.rate = policyAccessInNumber(answer);

                //It saves the operands as children of the operator
                logic.children.push(operand1);
                logic.children.push(operand2);

                //It returns logic as the node root of the answer
                return logic;

            } else {
                //The operation has more than two elements.
                // For example DOV(R1,R2,R3)
                //It has to be transformed by recursion into DOV[R1,DOV(R2,R3)]

                //It takes one of the operators are resolves it,
                //if it has not been resolve before
                var operand1 = operands.pop();
                // Since for example DOV(R1,R2,R3)
                // has to be transformed into DOV[R1,DOV(R2,R3)]
                // A new clone of Logic object is required
                // Since logic is a simple object with no circular evaluation
                //JSON.parse(JSON.stringify()) combination creates a non mutable copy.
                //It does not work in circular structures
                var logic2 = JSON.parse(JSON.stringify(logic));
                //It marks the new logic2 object to know if was generated by recursion
                logic2.generateByRecursion = true;
                //This is the recursive operation
                var operand2 = parseLastComposition(policyID, logic2, operands);
                //Getting logic inside name
                var myLogic = logic.name;

                //Getting the result of the logic applied to operands
                var answer = evalCompositionOperation(policyID, myLogic, operand1.access, operand2.access);
                //It saves the answer into the operation
                logic.logic = logic.name;
                logic.policyID = policyID;
                logic.access = answer;
                logic.rate = policyAccessInNumber(answer);
                //It saves the operands as children of the operator
                logic.children.push(operand1);
                logic.children.push(operand2);
                //It returns logic as the node root of the answer
                return logic;
            }
        }

        /**
         * This function transforms a policy value (effect) into a numeric value
         * 
         * Numeric values assigned to policy values are:
         * 
         *   1:Allow
         *   1:Permit
         *  -1:Deny
         *   0:NotApplicable
         *   0:Indeterminate
         *   0:Indeterminate(P)
         *   0:Indeterminate(D)
         *   0:Indeterminate(PD)
         * 
         * @param {type} access
         * @returns {Number}
         * 
         */
        function policyAccessInNumber(access) {

            if (access === "Allow") {
                return 1;
            } else if (access === "Permit") {
                return 1;
            } else if (access === "Deny") {
                return 0;
            } else if (access === "NotApplicable") {
                return -1;
            } else if (access === "Indeterminate(P)") {
                return -2;
            } else if (access === "Indeterminate(D)") {
                return -3;
            } else if (access === "Indeterminate(PD)") {
                return -4;
            } else if (access === "Indeterminate(PD)") {
                return -5;
            } else {
                return -5;
            }
        }

        /** This functions compacts a tree removing unnecessary node operators that 
         *  created during recurssion in the cases are not needed
         *  
         * Example:
         * 
         * 1. Composition: "DOV(R1,R2,FA(R1,R2,R1))"
         * 
         *    Policy: {"PA":"Permit",
         *             "PB":"NotApplicable"}
         * 
         * Creates a structure similar to this:
         * -----------------------------
         * | DOV                       |
         * | generatedByRecursion=false|
         * -----------------------------
         *     |  |---|
         *     +--|R1 |
         *     |  |---| 
         *     |  |-------------------------|
         *     +--|DOV                      |
         *        |generatedByRecursion=true|
         *        |-------------------------| 
         *          |  |--|
         *          +--|R2|
         *          |  |--| 
         *          |  |--------------------------|
         *          +--|FA                        |
         *             |generatedByRecursion=false|
         *             |--------------------------| 
         *                |  |--|
         *                +--|R1|
         *                |  |--|
         *                |  |-------------------------|
         *                +--|FA                       |
         *                   |generatedByRecursion=true|
         *                   |-------------------------| 
         *                      |  |--|
         *                      +--|R2|
         *                      |  |--|
         *                      |  |--|
         *                      +--|R1|
         *                         |--|                      
         * Which is passed to this function and it returns a structure similar to this
         * -----------------------------
         * | DOV                       |
         * | generatedByRecursion=false|
         * -----------------------------
         *     |  |---|
         *     +--|R1 |
         *     |  |---| 
         *     |  |--|
         *     +--|R2|
         *     |  |--| 
         *     |  |--------------------------|
         *     +--|FA                        |
         *        |generatedByRecursion=false|
         *        |--------------------------| 
         *           |  |--|
         *           +--|R1|
         *           |  |--|
         *           |  |-------------------------|
         *           +--|FA                       |
         *              |generatedByRecursion=true|
         *              |-------------------------| 
         *                 |  |--|
         *                 +--|R2|
         *                 |  |--|
         *                 |  |--|
         *                 +--|R1|
         *                    |--|   
         * 
         * FA generated by recursion and similar odered operations cannot be removed
         * 
         * @param {type} root
         * @returns {unresolved}
         */
        function removeUnneededCompositionOperators(root) {
            //Function only process arrays
            var tree = [];
            if (root instanceof Array) {
                tree = root;
            } else {
                tree.push(root);
            }
            //It calls the recursion

            var treeCopy = JSON.parse(JSON.stringify(tree));
            var answer = recursiveArrayInspection(treeCopy);
            //It returns an object at the end
            return answer.pop();

            /**
             * This is the recursive function to walk the whole tree
             * 
             * @param {type} tree
             * @returns {unresolved}
             */
            function recursiveArrayInspection(tree) {

                var top = tree.length;

                var answer = [];

                //Walking the tree
                for (var i = 0; i < top; i++) {

                    //This variable gets a pointer to the actual node
                    var node = tree[i];

                    if (node.generateByRecursion === false &&
                            node.logic !== "FA" &&
                            node.children.length === 0 &&
                            node.attribute === true) {

                        //This is the leaf node case
                        //There is nothing else to check

                        //Node is the current operation. It is going to be cloned
                        var myNode = new Node(node.rate, node.logic, node.name);
                        myNode.value = node.value;
                        myNode.attribute = node.attribute;
                        myNode.generateByRecursion = node.generateByRecursion;
                        myNode.access = node.access;
                        myNode.policyID = node.policyID;

                        //Saving the node
                        answer.push(myNode);

                        return answer;

                    } else if (node.generateByRecursion === true &&
                            node.logic !== "FA" &&
                            node.children.length > 0 &&
                            node.children[0].attribute === false) {

                        //This node has to be eliminated so it is jumped

                        var recursionOnChildren = recursiveArrayInspection(node.children);

                        //Saving the node
                        answer = answer.concat(recursionOnChildren);

                    } else {

                        //Node is the current operation. It is going to be cloned
                        var myNode = new Node(node.rate, node.logic, node.name);

                        //It continues the recursion process with the 
                        var recursionOnChildren = recursiveArrayInspection(node.children);

                        //It saves the result recursion into the newly created node      
                        myNode.children = myNode.children.concat(recursionOnChildren);
                        myNode.value = node.value;
                        myNode.attribute = node.attribute;
                        myNode.generateByRecursion = node.generateByRecursion;
                        myNode.access = node.access;
                        myNode.policyID = node.policyID;

                        //Saving the node
                        answer = answer.concat(myNode);
//                        answer.push(myNode);
                    }
                }
                return answer;
            }
        }

    };

    /**
     * This procedure updates all internal elements in the policy
     * @returns {undefined}
     */
    var update = function () {

        //It solves rules and stores resolutions in policy
        resolveRules();
        _policyTreeInJSON = parsePolicyToTree();
    };

    //=======================================================Priviledged methods
    //==========================================================================

    /**
     * This privileged method calls the internal update of the object
     * @returns {undefined}
     */
    this.policyUpdate = function () {

        //It uses the initialisation method to update the policy since it is not
        //known if some attributes or rules were deleted.

        init();
    };

    /**
     * This method returns the policy parsed in JSON memory structure
     * 
     * @returns {undefined}
     */
    this.getPolicyInJSON = function () {

        return _policyTreeInJSON;
    };

    /**
     * This method returns policy Attribute Values;
     * 
     * @returns {Array|Object|type}
     */
    this.getPolicyAttributeValues = function () {
        return _policyAttributeValues;
    };

    /**
     * The purpose of this function is to update a policy value 
     * 
     * @param {type} attribute
     * @param {type} value
     * @returns {undefined}
     */
    this.policyAttributeValueUpdate = function (attribute, value) {

        _policyAttributeValues[attribute] = value;
    };

    /**
     * This method returns the policy object
     * 
     * @returns {undefined}
     */
    this.getPolicy = function () {

        return _policy;
    };

    /**
     *This method sets policy rules
     *  
     * @param {type} policyRules
     * @returns {undefined}
     */
    this.setPolicyRules = function (policyRules) {

        _policyRules = policyRules;
    };

    /**
     *This method sets policy attributes
     *  
     * @param {type} policyAttributes
     * @returns {undefined}
     */
    this.setPolicyAttributes = function (policyAttributes) {

        _policyAttributeValues = policyAttributes;
    };

    /**
     * 
     * @param {type} oldKey
     * @param {type} newKey
     * @returns {undefined}
     */
    this.updatePolicyKey = function (oldKey, newKey) {

        if (oldKey !== newKey) {
            Object.defineProperty(_policyAttributeValues, newKey,
                    Object.getOwnPropertyDescriptor(_policyAttributeValues, oldKey));
            delete _policyAttributeValues[oldKey];
        }
    };

    /**
     * The purpose of this function is to add a policy value 
     * 
     * @returns {undefined}
     */
    this.addAttributeValueEmpty = function () {

        var myAttribute = "ATTRIBUTE_ok";
        var myValue = "Unknown";
        var mySize = Object.keys(_policyAttributeValues).length;
        mySize = mySize + 1;
        myAttribute = myAttribute + mySize;
        _policyAttributeValues[myAttribute] = myValue;
    };

    /**
     * The purpose of this method is to delete a policy value
     * 
     * @param {type} attributeKey
     * @returns {undefined}
     */
    this.deleteAttributeValue = function (attributeKey) {

        delete _policyAttributeValues[attributeKey];
    };

    /**
     * This method returns policy rules object;
     * 
     * @returns {Array|Object|type}
     */
    this.getPolicyRules = function () {
        return _policyRules;
    };
    
    //===================================================Object Constructor Code
    //==========================================================================

    init();
};

//If exports exists, we're on the server and need to export this class as a module.
if (typeof exports !== 'undefined') exports.Policy = Policy;