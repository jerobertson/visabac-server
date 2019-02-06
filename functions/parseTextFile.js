"use strict";

exports.parseTextFile = function (contentFile) {

    contentFile = contentFile.trim();
    
    //Spliting using the first { and keeping it 
    var mySeparator = (/(?={)/g);
    
    //It splits the expression using the tildes
    return contentFile.split(mySeparator);
};
