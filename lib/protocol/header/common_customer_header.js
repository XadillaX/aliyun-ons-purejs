/**
 * XadillaX created at 2015-12-21 14:12:59 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var RequestCode = require("../request_code");

/**
 * CommonCustomerHeader
 * @constructor
 */
var CommonCustomerHeader = function() {
    // base interface
    // to be inherited
};

/**
 * encode
 */
CommonCustomerHeader.prototype.encode = function() {
    // virtual function
    // to be inherited and overrided
};

/**
 * decode
 * @param {Number} code the message type
 * @param {Buffer} buff the buffer to be decoded
 * @param {Boolean} isResponseType whether it's response type
 * @return {CommonCustomerHeader} the header object to be returned
 */
CommonCustomerHeader.decode = function(code, buff, isResponseType) {
    if(isResponseType) {
        switch(code) {
            case RequestCode.SEND_MESSAGE_VALUE.value: {
                var SMRH = require("./send_message_response_header");
                return SMRH.decode(buff);
            }

            case RequestCode.PULL_MESSAGE_VALUE.value: {
                var PMRH = require("./pull_message_response_header");
                return PMRH.decode(buff);
            }

            default: break;
        }
    }

    return null;
};

/**
 * decodeReplaceLonglong
 * @param {String} str the json string
 * @param {Array} columns columns to be replaced
 * @return {String} the replaced json string
 */
CommonCustomerHeader.decodeReplaceLonglong = function(str, columns) {
    var tpl = "\"%s\"\s*:\s*(\d+)";
    var tplReplaced = "\"%s\":\"$1\"";

    var jsonStr = str;
    for(var i = 0; i < columns.length; i++) {
        var column = columns[i];
        var src = new RegExp(util.format(tpl, column));
        var dest = util.format(tplReplaced, column);
        jsonStr = jsonStr.replace(src, dest);
    }

    return jsonStr;
};

module.exports = CommonCustomerHeader;
