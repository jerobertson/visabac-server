"use strict";

/**
 * Returns a simple plaintext "hello world" message.
 * 
 * @author James Robertson
 */
exports.helloworld = function(req, res) {
    res.send("Hello world!");
}