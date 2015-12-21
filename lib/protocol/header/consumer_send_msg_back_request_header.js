/**
 * XadillaX created at 2015-12-21 16:45:00 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var Long = require("long");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * ConsumerSendMsgBackRequestHeader
 * @constructor
 */
var ConsumerSendMsgBackRequestHeader = function() {
    CommonCustomerHeader.call(this);

    this.offset = new Long(0, 0);
    this.group = "";
    this.delayLevel = -1;
};

util.inherits(ConsumerSendMsgBackRequestHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
ConsumerSendMsgBackRequestHeader.prototype.encode = function() {
    var jsonStr = JSON.stringify({
        offset: this.offset.toString(),
        group: this.group,
        delayLevel: parseInt(this.delayLevel)
    });

    jsonStr = jsonStr.replace(/"offset"\s*:\s*"(\d+)"/, "\"offset\":$1");
    return new Buffer(jsonStr);
};

/**
 * decode
 * @param {Buffer} buff the encoded buffer
 * @return {ConsumerSendMsgBackRequestHeader} the send message header object
 */
ConsumerSendMsgBackRequestHeader.decode = function(buff) { /* jshint ignore: line */
    return new ConsumerSendMsgBackRequestHeader();
};

module.exports = ConsumerSendMsgBackRequestHeader;
