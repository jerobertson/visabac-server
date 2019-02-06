/*  
 * David Sanchez
 * Newcastle University. 2016
 * 
 * This is the Question object, used to create a test
 * 
 */


/**
 * This declaration avoids the common alert that d3 is not declared
 * @type window.d3|Window.d3
 */
var d3 = window.d3 || {};

/**
 * This declaration avoids the aler that preferences is not declared.
 * It will be defined once preferences get loaded
 * 
 * @type type
 */
var preferences;



/* This is the  Div ID in which radio buttons are*/
var panelPolicyDetails = document.getElementById("panelPolicyDetails");




/**
 * A visualiser is an object with a particular structure
 * 
 * @param {type} policyAttributeValues
 * @param {type} logic
 * @returns {Visualiser}
 */
var Visualiser = function (logic, policyAttributeValues) {

    //private attributes
    var _logic = logic;
    var _policyRules;
    var _policy;
    var _samples = [];

    //Colours
//    var myBlack = 'rgb(0,0,0)';   //black. Safari does not support 'black'

    //Permit=1
    var myGreen = "#3CA542";    //'rgb(0,150,0)'; green. Safari does not support 'green'
    var myBlue = "#0000FF";
    var permitColour = (preferences['colourPreferences'] === "Normal") ? myGreen : myBlue;

    //Deny=0
    var myRed = "#D77B79"; //'rgb(255,0,0)';//red. Safari does not support 'red'
    var myYellow = "#DAA520"; //Golden Yellow
    var denyColour = (preferences['colourPreferences'] === "Normal") ? myRed : myYellow;

    //NotApplicable=-1
    var notApplicableColour = '#FFFFFF';       //white.
    //Indeterminate(P)
    var indeterminatePColour = '#D3D3D3';    //Light gray color
    //Indeterminate(D)
//    var indeterminateDColour = '#808080';         //gray color
    //Indeterminate(PD) and Interminate
//    var indeterminatePDColour = '#A9A9A9';       //Dark gray

    //Private methods

    /**
     * This method draws answers on the console on the screen
     */
    var drawConsole = function () {

        var myPolicy = _policy.getPolicy();

        //It adds the policy evaluation  to the console panel
        var myConsole = document.getElementById("console");

        var result = "";
        for (var key in myPolicy) {
            if (myPolicy.hasOwnProperty(key)) {

                var policyName = key;
                var policyValue = myPolicy[key];

                if (policyValue === "Permit") {
                    result = result + policyName + ": ";
                    result = result + "<FONT COLOR='" + permitColour + "'>" + policyValue + "</FONT>" + "\n\ ";

                } else if (policyValue === "Deny") {
                    result = result + policyName + ": ";
                    result = result + "<FONT COLOR='" + denyColour + "'>" + policyValue + "</FONT>" + "\n\ ";

                } else if (policyValue === "Indeterminate(P)") {
                    result = result + policyName + ": ";
                    result = result + "<FONT COLOR='" + indeterminatePColour + "'>" + "Indeterminate" + "</FONT>";
                    result = result + "<FONT COLOR='" + permitColour + "'>" + "(P)" + "</FONT>" + "\n\ ";

                } else if (policyValue === "Indeterminate(D)") {
                    result = result + policyName + ": ";
                    result = result + "<FONT COLOR='" + indeterminatePColour + "'>" + "Indeterminate" + "</FONT>";
                    result = result + "<FONT COLOR='" + denyColour + "'>" + "(D)" + "</FONT>" + "\n\ ";

                } else if (policyValue === "Indeterminate(PD)") {
                    result = result + policyName + ": ";
                    result = result + "<FONT COLOR='" + indeterminatePColour + "'>" + policyValue + "</FONT>" + "\n\ ";

                } else if (policyValue === "NotApplicable") {
                    result = result + policyName + ": ";
                    result = result + "<FONT COLOR='" + notApplicableColour + "'>" + "Not Applicable" + "</FONT>" + "\n\ ";
                }
            }
        }

        myConsole.innerHTML = result.replace(/(\r\n|\n|\r)/gm, "<br>");
    };

    /**
     * This method refreshes the graphic part of the screen
     * @returns {undefined}
     */
    var draw = function () {

        //Detaches a graphic element from the board if it exists
        d3.select("svg").remove();

        var myContainerPanel = document.getElementById("container");
        myContainerPanel.style.display = 'none';

        myContainerPanel.style.display = 'inline-block';

        //======================================================================
        //Drawing the circle according to the information save inside the object
        new LogicCirclePacking(_policy.getPolicyInJSON());
        //=====================================================================

        //Drawing the console;
        drawConsole();
    };

    /**
     * This private method creates all the radio buttons;
     * 
     * @param {type} myPolicyValues
     * @returns {undefined}
     */
    var createRadioButtons = function (myPolicyValues) {
        for (var key in myPolicyValues) {
            if (myPolicyValues.hasOwnProperty(key)) {

                var policyName = key;
                var policyValue = myPolicyValues[key];

                //It creates each group of radio buttons
                createRadioGroup(policyName, policyValue);
            }
        }

        /**
         * This private function creates a radio group.
         * It usually comprises three radio buttons: Allow(Permit), Deny and Undetermined(Unknown)
         * 
         * @param {type} policyName
         * @param {type} policyValue
         * @returns {undefined}
         */
        function createRadioGroup(policyName, policyValue) {

            var paragraphElement = document.createElement("div");
            panelPolicyDetails.appendChild(paragraphElement);

            //==========================================================Checkbox
            /*creating checkbox attribute*/
            var myCheckBox = document.createElement("input");
            myCheckBox.setAttribute("type", "checkbox");
            /*set unique group name for the checkbox */
            myCheckBox.setAttribute("id", policyName + "Checkbox");
            /*Assign a class to css the checkbox*/
            myCheckBox.setAttribute("class", "checkboxElement");
            /*Set id of new created checkbox asn the policyName*/
            myCheckBox.setAttribute("name", policyName + "Checkbox");
            /*It adds and event listener to enable and disable the delete button*/
            myCheckBox.addEventListener("change", function () {
                enableDisableDeleteButton();
            });
            /*Append the label to the separator*/
            paragraphElement.appendChild(myCheckBox);





            //=======================================================Group Label
            /*Creating an input text for a label of a radio button*/
            var myGroupLabel = document.createElement("input");
            myGroupLabel.type = "text";
            /*It sets the value of the input text*/
            myGroupLabel.value = policyName;

            /*create text node for label Text which display for Radio button*/
            /*Assign a class to css the radio button*/
            myGroupLabel.setAttribute("class", "radioInput");

            //It adds an event listener when click is pressed over the label
            myGroupLabel.addEventListener("click", function () {
                this.select();
            });
            //It adds an event listener to save the old value when lost is focus
            myGroupLabel.addEventListener("focus", function () {
                this.oldvalue = this.value;
            });
            //It adds and event listener to update the radio ID 
            myGroupLabel.addEventListener("change", function () {
                updateRadioCheckboxID(this.oldvalue, this.value);
            });

            /*Append the label to the separator*/
            paragraphElement.appendChild(myGroupLabel);





            //======================================Creating Radio Group options
            if (policyValue === "Allow") {
                createRadioElement(policyName, "Allow", "checked", paragraphElement);
                createRadioElement(policyName, "Deny", "", paragraphElement);
                createRadioElement(policyName, "Undetermined", "", paragraphElement);
            } else if (policyValue === "Permit") {
                createRadioElement(policyName, "Permit", "checked", paragraphElement);
                createRadioElement(policyName, "Deny", "", paragraphElement);
                createRadioElement(policyName, "Undetermined", "", paragraphElement);
            } else if (policyValue === "True") {
                createRadioElement(policyName, "True", "checked", paragraphElement);
                createRadioElement(policyName, "False", "", paragraphElement);
                createRadioElement(policyName, "Unknown", "", paragraphElement);
            } else if (policyValue === "Deny") {
                createRadioElement(policyName, "Allow", "", paragraphElement);
                createRadioElement(policyName, "Deny", "checked", paragraphElement);
                createRadioElement(policyName, "Undetermined", "", paragraphElement);
            } else if (policyValue === "False") {
                createRadioElement(policyName, "True", "", paragraphElement);
                createRadioElement(policyName, "False", "checked", paragraphElement);
                createRadioElement(policyName, "Unknown", "", paragraphElement);
            } else if (policyValue === "Undetermined") {
                createRadioElement(policyName, "Allow", "", paragraphElement);
                createRadioElement(policyName, "Deny", "", paragraphElement);
                createRadioElement(policyName, "Undetermined", "checked", paragraphElement);
            } else if (policyValue === "Unknown") {
                createRadioElement(policyName, "True", "", paragraphElement);
                createRadioElement(policyName, "False", "", paragraphElement);
                createRadioElement(policyName, "Unknown", "checked", paragraphElement);
            }
        }

        /**
         * This private function creates each radio element of a group.
         * They are usually one of a three kind: Allow(True), Deny(False) and Undetermined(Unkown).
         * It is check marked if the checked parameter is marked as true.
         * 
         * @param {type} name
         * @param {type} policyValue
         * @param {type} checked
         * @param {type} container
         * @returns {undefined}
         */
        function createRadioElement(name, policyValue, checked, container) {

            var myRadio = document.createElement("input");
            myRadio.setAttribute("type", "radio");
            /*Set id of new created radio button*/

            /*Assign a class to css the radio button*/
            myRadio.setAttribute("class", "radioElement");

            /*Set id of new created radio button*/
            myRadio.setAttribute("id", name + policyValue);
            /*set unique group name for pair of Yes / No */
            myRadio.setAttribute("name", name + "Group");
            /*set value for each element*/
            myRadio.setAttribute("value", policyValue);

            /*set seleccion*/
            if (checked === "checked") {
                myRadio.setAttribute("checked", checked);
            }

            /*creating label for Radio button*/
            var myRadioLabel = document.createElement("label");
            /*create text node for label Text which display for Radio button*/
            var myRadioText = document.createTextNode(policyValue);

            /*Assign a class to css the radio button*/
            myRadioLabel.setAttribute("class", "radioLabel");

            /*add text to new create lable*/
            myRadioLabel.appendChild(myRadioText);

            container.appendChild(myRadio);
            container.appendChild(myRadioLabel);
        }

        /**
         * This function updates the name of a radio group and checkbox after leaving the field to
         * make it concordant with the attribute name
         *  
         * @param {type} oldValue
         * @param {type} newValue
         * @returns {undefined}
         */
        function updateRadioCheckboxID(oldValue, newValue) {

            var radios = document.getElementsByName(oldValue + "Group");

            //Changing loop names
            while (radios.length > 0) {

                var radio = radios[0];

                radio.id = radio.id.replace(oldValue, newValue);
                radio.name = newValue + "Group";
            }

            //Updating Key
            _policy.updatePolicyKey(oldValue, newValue);

            //Reference to checkbox
            var checkboxes = document.getElementsByName(oldValue + "Checkbox");

            //Changing loop names
            while (checkboxes.length > 0) {

                var checkbox = checkboxes[0];

                checkbox.id = checkbox.id.replace(oldValue, newValue);
                checkbox.name = newValue + "Checkbox";
            }
        }
    };

    /**
     * This method enables/disables the delete Attribute button
     * @returns {undefined}
     */
    var enableDisableDeleteButton = function () {

        //Reference to checkbox
        var checkboxes = document.getElementsByClassName("checkboxElement");

        for (var i = 0, length = checkboxes.length; i < length; i++) {
            if (checkboxes[i].checked) {

                //Updates the delete button status
                var deleteButton = document.getElementById("deleteAttribute");
                deleteButton.disabled = false;
                break;
            } else {
                //Updates the delete button status
                var deleteButton = document.getElementById("deleteAttribute");
                deleteButton.disabled = true;
            }
        }
    };

    /**
     * This function selects the right CSS according to preferences set by user
     * 
     * @returns {undefined}
     */
    var chooseColourModeCSS = function () {

        var styleNormal = document.getElementById("styleNormal");

        var styleVisionDeficiency = document.getElementById("styleVisionDeficiency");

        if (preferences['colourPreferences'] === "Normal") {

            styleNormal.setAttribute("rel", "stylesheet");
            styleVisionDeficiency.setAttribute("rel", "alternate stylesheet");

            styleNormal.disabled = false;
            styleVisionDeficiency.disabled = true;

        } else {

            styleNormal.setAttribute("rel", "alternate stylesheet");
            styleVisionDeficiency.setAttribute("rel", "stylesheet");

            styleNormal.disabled = true;
            styleVisionDeficiency.disabled = false;
        }
    };

    /**
     * This methods reads the policy rules interface to update the private _logic variable
     * 
     * @returns {undefined}
     */
    var readPolicyRules = function () {

        //It reads the policy Rules
        var myPolicyRules = document.getElementById("policy");

        if (myPolicyRules !== null) {

            //It gets the text from the policy 
            var myPolicy = myPolicyRules.value;

            //It saves the logic policy as it is
            _logic = myPolicy;
        }
    };

    /**
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
     * @returns {undefined}
     */
    var parsePolicyRules = function () {

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

            //It updates the policy Rules with the new policyRules
            _policyRules = policyRules;

        }
    };

    /**
     * This methods reads the policy attributes interface to determine their values
     * 
     * Example:
     * 
     * Entering this into the interface
     * 
     *                       True False Unknown
     * PATIENT_disagrees       *
     * 
     * It should update the key object value to
     * 
     * {"PATIENT_disagrees":True}
     * 
     * @returns {undefined}
     */
    var readPolicyAttributes = function () {

        //It reads policy attributes
        var policyValues = _policy.getPolicyAttributeValues();

        for (var key in policyValues) {
            if (policyValues.hasOwnProperty(key)) {

                var radios = document.getElementsByName(key + "Group");
                for (var i = 0, length = radios.length; i < length; i++) {
                    if (radios[i].checked) {

                        //Updates the policy
                        _policy.policyAttributeValueUpdate(key, radios[i].value);

                        //only one radio can be logically checked, don't check the rest
                        break;
                    }
                }
            }
        }
    };

    /**
     * This procedure creates and recreates the Panel Policy
     * @returns {undefined}
     */
    var createPanelPolicy = function () {

        //It adds the policy explained in common English to the text area
        //PolicyRules saves the object with policys while _logic saves the plane text
        var myLogic = document.getElementById("policy");
        myLogic.value = _logic;

    };

    /**
     * This method creates and recreates the Panel Policy Details
     * 
     * @returns {undefined}
     */
    var createPanelPolicyDetails = function () {

        //It recreates the radio buttons
        var myPanelPolicyDetails = document.getElementById("panelPolicyDetails");
        if (myPanelPolicyDetails) {
            myPanelPolicyDetails.innerHTML = '';
        }

        //It creates the radio buttons
        createRadioButtons(_policy.getPolicyAttributeValues());

        //Enable and disable the Delete button since all deletes were performed
        enableDisableDeleteButton();
    };

    /**
     * This method handles events received from the dialog box when loading a policy file
     * 
     * It loads the file if load is confirmed.
     * 
     * @param {type} evt
     * @returns {undefined}
     */
    var handleLoadPolicyButton = function (evt) {

        // Check for the File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.

            //All target files from the event
            var files = evt.target.files; // FileList object
            //Seleting the first one only
            var file = files[0];

            //It creates a file reader
            var reader = new FileReader();

            //Event to load information
            reader.addEventListener("load", function (event) {

                var textFile = event.target;

                //It parses the result and load info into memory
                parseTextFile(textFile.result);

                //It calles the private method to update the interface
                update();

            }, false);

            //Check if there is a file
            if (file) {

                // Read in the image file as a data URL.
                reader.readAsText(file);
            }

        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    };

    /**
     * This private method creates one sample menu
     * 
     * @param {type} sample
     * @returns {undefined}
     */
    var createSampleMenu = function (sample) {

        //It attaches an event handler for the "select sample" menu
        var paragraphElement = document.getElementById('samples_dropdown');

        /*creating the menu item*/
        var myMenuItem = document.createElement("option");
        myMenuItem.setAttribute("value", sample.id);
        myMenuItem.text = "Sample " + sample.id;

        /*Append the menu item*/
        paragraphElement.appendChild(myMenuItem);
    };

    /**
     * This method handles events received from the select menu when loading a sample policy
     * 
     * @returns {undefined}
     */
    var handleSelectSampleMenu = function () {

        //Selected index
        var selIndex = this.selectedIndex;

        if (selIndex !== 0) {
                //It adjustes the index to use on an array
                selIndex = (selIndex > 0) ? selIndex - 1 : selIndex;

                //Finds the textSample corresonding to the selected value
                var sample = _samples[selIndex];

            var x = window.confirm("Are you sure you want to load Sample " + sample.id + "?");

            if (x) {

                //The second position should be the policy attributes
                var myPolicyAttributes = sample.attributeValues;

                //It sets the logic 
                _logic = sample.logic;

                //It parse the policy Rules
                parsePolicyRules();

                //It updates the policy Rules with the new policyRules
                _policy.setPolicyRules(_policyRules);

                //It sets the policy Attributes
                _policy.setPolicyAttributes(myPolicyAttributes);

                //This updates the local variables
                _policy.policyUpdate();

                //It calles the private method to update the interface
                update();
                
                //It resets the menu to show the 'Samples...' label
                this[0].selected="selected";
            }
        }
    };

    /**
     * This method parse a text file that has been loaded into a memory structure 
     * 
     * @param {type} contentFile
     * @returns {undefined}
     */
    var parseTextFile = function (contentFile) {

        contentFile = contentFile.trim();
        
        //Spliting using the first { and keeping it 
        var mySeparator = (/(?={)/g);
        
        //It splits the expression using the tildes
        var myPolicyArray = contentFile.split(mySeparator);

        //The first position should be the policy Rules
        var myLogic = myPolicyArray[0];

        //The second position should be the policy attributes
        var myPolicyAttributes = JSON.parse(myPolicyArray[1]);

        //It sets the logic 
        _logic = myLogic;

        //It sets the policy Rules
        parsePolicyRules();

        //It updates the policy Rules with the new policyRules
        _policy.setPolicyRules(_policyRules);

        //It sets the policy Attributes
        _policy.setPolicyAttributes(myPolicyAttributes);

        //Updates the visualiser
        _policy.policyUpdate();
    };

    /**
     * This defines the show method which calls all procedures to
     * draw themselved.
     * 
     * @returns {undefined}
     */
    var update = function () {

        //It recreates the policy
        createPanelPolicy();

        //It recreates the policy details
        createPanelPolicyDetails();

        //It draws all elements of the interface
        draw();
    };

    /**
     * This method init the Visualiser calling some methods internally:
     *  
     * 1. Selects the colour mode
     * 2. Attaches an event handler to the Load Policy button
     * 3. Attaches an event handler to the select sample menu
     * 
     * @returns {undefined}
     */
    var init = function () {
        
        //It parses the logic and creates the policy
        parsePolicyRules();
        
        //It creates the policy
        _policy = new Policy(policyAttributeValues, _policyRules);
        
        chooseColourModeCSS();

        //It attaches an event handler for the "load..." buton
        document.getElementById('hiddenLoadPolicy').addEventListener('change', handleLoadPolicyButton, false);
        
        //It attaches an event handler for the "select sample" menu
        document.getElementById('samples_dropdown').addEventListener('change', handleSelectSampleMenu, false);     
    };

//Privileged methods

    /**
     * This defines the show method which calls all procedures to
     * draw themselved.
     * 
     * @returns {undefined}
     */
    this.show = function () {

        //It calles the private method to update the interface
        update();
    };

    /**
     * The purpose of this function is to read the interface and update the policy
     * values according to what the user has answered.
     * 
     * @returns {undefined}
     */
    this.evaluate = function () {

        //It reads the policy attributes
        readPolicyAttributes();

        //It reads the policy Rules
        readPolicyRules();

        //It parse the policy Rules
        parsePolicyRules();
        
         //It updates the policy Rules with the new policyRules
        _policy.setPolicyRules(_policyRules);
        
        //This updates the local variables
        _policy.policyUpdate();

        //This updates just the graph and console to improve efficiency
        draw();
    };

    /**
     * This method adds an attribute to the policy attributes list
     * 
     * @returns {undefined}
     */
    this.addAttribute = function () {
        _policy.addAttributeValueEmpty();

        //It refreshes the interface to show the changes
        createPanelPolicyDetails();
    };

    /**
     * This method delete the selected attributes from the policy attributes list
     * 
     * It first asks the user if he is sure about deleting the selected attributes.
     * 
     * @returns {undefined}
     */
    this.deleteSelectedAttributes = function () {

        var x = window.confirm("Are you sure you want to delete the selected attributes?");

        if (x) {
            //Reference to checkbox
            var checkboxes = document.getElementsByClassName("checkboxElement");

            //Changing loop names
            for (var i = 0, length = checkboxes.length; i < length; i++) {

                if (checkboxes[i].checked) {

                    var checkbox = checkboxes[i];
                    var id = checkbox.id;

                    id = id.substring(0, id.lastIndexOf("Checkbox"));

                    //Deleting the policy key
                    _policy.deleteAttributeValue(id);

                }
            }

            //It recreates the policy details
            createPanelPolicyDetails();
        }
    };

    /**
     * This method saves the policy to file including its attributes
     * 
     * @returns {undefined}
     */
    this.save = function () {

        //This structure saves the policy
        var myPolicyArray = [];

        //It updates logic from the interface
        readPolicyRules();

        //It gets the logic
        var myLogic = _logic;
        //It saves the logic into the array
        myPolicyArray.push(myLogic);

        //It gets the policy Attributes
        var myPolicyAttributes = _policy.getPolicyAttributeValues();
        //It creates a string from the JSON object
        var myPolicyAttributesString = JSON.stringify(myPolicyAttributes);
        //It saves the result into the array
        myPolicyArray.push(myPolicyAttributesString);

        //It combines the policy and attributes into one file using aa return key
        var mySeparator = "\n";

        var myPolicyString = myPolicyArray.join(mySeparator);

        //It appends the element to a document model to save it, using the appropriate encoding set
        var a = document.createElement('a');
        a.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(myPolicyString);
        a.target = '_blank';
        a.download = 'policy.txt';

        //It forces a download
        document.body.appendChild(a);
        a.click();
    };

    /**
     * This method pushes sample elements into the samples queue
     * @param {type} element
     * @returns {undefined}
     */
    this.pushSample = function (element) {
        _samples.push(element);
        
        //It pushes the element to the menu
        createSampleMenu(element);
    };





    /*
     * It inits the object once created
     */
    init();
};