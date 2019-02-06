/* 
 *
 * David Sanchez
 * Newcastle University. 2016
 * 
 * This Node object is the main structure of a policy.
 * 
 * 
 * 
 */

/**
 * This is a node class object inside the policy tree
 * 
 * rate                : It is used to give different colours and patterns to the circle.
 * 
 * value               : It is not used. It is used as a scaller, given different sizes to circles. 
 *                       So far, all circles have same size.
 *                       
 * logic               : Composition operators, for example DOV, POV, FA, OOA, etc.
 * 
 * name                : it is the name of the note, it could be DOV, R1, etc.. or the name of the attribute
 * 
 * attribute           : true or false, used to marked if it is an attribute node
 * 
 * generateByRecursion : true or false, used to know which nodes are generated as the
 *                       consequence of a recursive evaluation
 *                       
 * access              : Stores values like Permit, Deny, IndeterminatePD...
 * 
 * policyID            : Stores the identifier for the policy ID to which this node belongs to
 * 
 * children            : Stores all children operations
 * 
 * @param {type} rate
 * @param {type} logic
 * @param {type} name
 * @returns {logicToJSON.Node}
 */
var Node = function (rate, logic, name) {
    this.rate = rate;
    this.value = 1;
    this.logic = logic;
    this.name = name;
    this.attribute = false;
    this.generateByRecursion = false;
    this.access = "";
    this.policyID = "";
    this.children = [];
};

if (typeof exports !== 'undefined') exports.Node = Node;