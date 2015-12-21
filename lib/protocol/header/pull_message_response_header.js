/**
 * XadillaX created at 2015-12-21 15:40:08 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var debug = require("debug")("pull_message_response_header");
var Long = require("long");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * PullMessageResponseHeader
 * @constructor
 */
var PullMessageResponseHeader = function() {
    CommonCustomerHeader.call(this);

    this.suggestWhichBrokerId = new Long(0, 0);
    this.nextBeginOffset = new Long(0, 0);
    this.minOffset = new Long(0, 0);
    this.maxOffset = new Long(0, 0);
};

util.inherits(PullMessageResponseHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
PullMessageResponseHeader.prototype.encode = function() {
    return "{\"suggestWhichBrokerId\":" + this.suggestWhichBrokerId.toString() + "," +
        "\"nextBeginOffset\":" + this.nextBeginOffset.toString() + "," +
        "\"minOffset\":" + this.minOffset.toString() + "," +
        "\"maxOffset\":" + this.maxOffset.toString() +
        "}";
};

/**
 * decode
 * @param {Buffer} buff the encoded buffer
 * @return {PullMessageResponseHeader} the send message header object
 */
PullMessageResponseHeader.decode = function(buff) {
    var jsonStr = buff.slice(8).toString();
    var object;
    jsonStr = CommonCustomerHeader.decodeReplaceLonglong(jsonStr, [
        "suggestWhichBrokerId",
        "nextBeginOffset",
        "minOffset",
        "maxOffset"
    ]);

    try {
        object = JSON.parse(jsonStr);
    } catch(e) {
        debug(e);
        return null;
    }

    var ext = object.extFields;

    var header = new PullMessageResponseHeader();
    header.suggestWhichBrokerId = Long.fromString(ext.suggestWhichBrokerId);
    header.nextBeginOffset = Long.fromString(ext.nextBeginOffset);
    header.minOffset = Long.fromString(ext.minOffset);
    header.maxOffset = Long.fromString(ext.maxOffset);

    return header;
};

module.exports = PullMessageResponseHeader;
