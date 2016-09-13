/**
 * XadillaX created at 2016-09-12 15:29:52 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const CppUtil = require("../build/Release/cpp_util");

/**
 * Javascript implement of java.lang.String => hashCode
 * @param {String} str the original string
 * @returns {Number} the 32-bit integer hash code
 * @refer https://gist.github.com/larchanka/9367841
 */
exports.hash = function(str) {
    if(!str.length) return 0;

    let hash = 0;
    for(let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;

        // convert to 32-bit integer
        hash = hash & hash;
    }

    return hash;
};

/**
 * Get nano time of the system
 * @returns {Number} the nano time will be returned
 * @refer http://stackoverflow.com/questions/6002808/is-there-any-way-to-get-current-time-in-nanoseconds-using-javascript#answer-35675599
 */
exports.nanoTime = function() {
    const hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
};

/**
 * Get local IP address
 * @returns {String} the IP address
 */
exports.getLocalAddress = function() {
    return CppUtil.getLocalAddress();
};
