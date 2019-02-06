"use strict";

/**
     * Extracted from Visualiser.js by David Sanchez, Newcastle University, 2016.
     * Modified by James Robertson, Newcastle University, 2019, to work with Node.js.
     * 
     * This method parse a text file that has been loaded into a memory structure 
     * 
     * @param {type} contentFile
     * @returns {String[]}
     */
exports.parseTextFile = function (contentFile) {

    contentFile = contentFile.trim();
    
    //Spliting using the first { and keeping it 
    var mySeparator = (/(?={)/g);
    
    //It splits the expression using the tildes
    return contentFile.split(mySeparator);
};
