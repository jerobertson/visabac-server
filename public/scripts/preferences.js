/* 
 * David Sanchez
 * Newcastle University. 2017
 * 
 * This code modifies preferences
 * 
 */

//Building an object to store the preferences
var preferences = {};

/**
 * This procedure creates the defaults for the preferences
 * 
 * @returns {undefined}
 */
var initPreferences = function () {

    if ((Object.keys(preferences).length === 0 && preferences.constructor === Object) &&
            (typeof (Storage) !== "undefined")) {

        //Code for localStorage/localStorage.
        var preferencesString = localStorage.getItem('preferences');

        if (preferencesString === null) {

            preferences['testMode'] = "Text+Graph";
            preferences['colourPreferences'] = "Normal";

            //Stringifying results to send it via session Storage
            var preferencesString = JSON.stringify(preferences);
            localStorage.setItem('preferences', preferencesString);
        }
    }

    //It load preferences
    loadPreferences();


};

/**
 * This method saves the preferences that are changed by the user
 * 
 * @returns {undefined}
 */
var savePreferences = function () {

    var radioTestMode = document.getElementsByName("preferenceTestModeGroup");

    for (var i = 0, length = radioTestMode.length; i < length; i++) {
        if (radioTestMode[i].checked) {

            preferences['testMode'] = radioTestMode[i].value;

            //only one radio can be logically checked, don't check the rest
            break;
        }
    }

    var radioColourPreferences = document.getElementsByName("preferenceColourGroup");

    for (var i = 0, length = radioColourPreferences.length; i < length; i++) {
        if (radioColourPreferences[i].checked) {

            preferences['colourPreferences'] = radioColourPreferences[i].value;

            //only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if (typeof (Storage) !== "undefined") {

        //Stringifying results to send it via session Storage
        var preferencesString = JSON.stringify(preferences);
        localStorage.setItem('preferences', preferencesString);

    } else {
        // Sorry! No Web Storage support..
    }
};

/**
 * This method loads the preferences from the user session
 * 
 * @returns {undefined}
 */
var loadPreferences = function () {

    if (typeof (Storage) !== "undefined") {

        //Code for localStorage/localStorage.
        var preferencesString = localStorage.getItem('preferences');

        preferences = JSON.parse(preferencesString);

        //Get the name of the window
        var currentWindow = getCurrentWindow();

        if (currentWindow === "preferences.html") {
            //It draws the screen if this is the preferences html file

            if (preferences['testMode'] === "Text") {
                var radioTestModeText = document.getElementById("preferencesTestModeText");
                radioTestModeText.checked = true;

            } else {
                var radioTestModeGraphic = document.getElementById("preferencesTestModeGraphic");
                radioTestModeGraphic.checked = true;
            }


            if (preferences['colourPreferences'] === "Normal") {
                var radioColourPreferencesNormal = document.getElementById("PreferencesColourNormal");
                radioColourPreferencesNormal.checked = true;
            } else {
                var radioColourPreferencesColourDeficiency = document.getElementById("PreferencesColourDeficiency");
                radioColourPreferencesColourDeficiency.checked = true;
            }
        }
    } else {
        // Sorry! No Web Storage support..
    }
};

/**
 * This function returns the name of the current window
 * 
 * @returns {getCurrentWindow.segments}
 */
var getCurrentWindow = function () {
    var segments = window.location.pathname.split('/');
    var toDelete = [];
    for (var i = 0; i < segments.length; i++) {
        if (segments[i].length < 1) {
            toDelete.push(i);
        }
    }
    for (var i = 0; i < toDelete.length; i++) {
        segments.splice(i, 1);
    }

    var filename = segments[segments.length - 1];

    return filename;

};





initPreferences();