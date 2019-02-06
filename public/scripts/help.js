/*
 * David Sanchez
 * Newcastle University. 2017
 *  
 * This code is used to support the help behaviour
 *  
 */

/**
 * This declaration is used to avoid warnings.
 * preferences will be resolved at runtime when preferences.js is executed
 * 
 * @type type
 */
var preferences;

/**
 * This function hndles the opening of tabs
 * 
 * @param {type} evt
 * @param {type} tabName
 * @returns {undefined}
 */
var openTab = function (evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    if (tabName === 'Operators') {
        // Get the element with id="defaultOpen" and click on it
        document.getElementById("defaultSubTabOpen").click();
    }
};

/**
 * This function handles the opening of subtabs
 * 
 * @param {type} evt
 * @param {type} tabName
 * @returns {undefined}
 */
var openSubTab = function (evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("subTabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("subTablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
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






var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

// The onload:
window.onload = function () {
    if (preferences['colourPreferences'] === "Normal") {
        document.getElementById("dupImage").src = "../images/operators/dup.png";
        document.getElementById("dupImage").style.display = "block";

        document.getElementById("pudImage").src = "../images/operators/pud.png";
        document.getElementById("pudImage").style.display = "block";
        
        document.getElementById("fullCircleImage").src = "../images/policy/full_circle.png";
        document.getElementById("fullCircleImage").style.display = "block";
        
        document.getElementById("zoomImage").src = "../images/policy/zoom.png";
        document.getElementById("zoomImage").style.display = "block";
        
        document.getElementById("consoleImage").src = "../images/policy/console.png";
        document.getElementById("consoleImage").style.display = "block";
        
        
    } else {
        document.getElementById("dupImage").src = "../images/operators/dup_colourDeficiency.png";
        document.getElementById("dupImage").style.display = "block";

        document.getElementById("pudImage").src = "../images/operators/pud_colourDeficiency.png";
        document.getElementById("pudImage").style.display = "block";

        document.getElementById("fullCircleImage").src = "../images/policy/full_circleColourDeficiency.png";
        document.getElementById("fullCircleImage").style.display = "block";
        
        document.getElementById("zoomImage").src = "../images/policy/zoomColourDeficiency.png";
        document.getElementById("zoomImage").style.display = "block";
        
        document.getElementById("consoleImage").src = "../images/policy/consoleColourDeficiency.png";
        document.getElementById("consoleImage").style.display = "block";
    }

};











// Choose the color mode for the page
chooseColourModeCSS();

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();