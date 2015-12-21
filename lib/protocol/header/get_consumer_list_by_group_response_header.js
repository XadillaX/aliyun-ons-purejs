/**
 * XadillaX created at 2015-12-21 16:41:11 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * GetConsumerListByGroupResponseHeader
 * @constructor
 */
var GetConsumerListByGroupResponseHeader = function() {
    CommonCustomerHeader.call(this);
};

util.inherits(GetConsumerListByGroupResponseHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
GetConsumerListByGroupResponseHeader.prototype.encode = function() {
    return "{}";
};

/**
 * decode
 * @param {Buffer} buff the encoded buffer
 * @return {GetConsumerListByGroupResponseHeader} the send message header object
 */
GetConsumerListByGroupResponseHeader.decode = function(buff) { /* jshint ignore: line */
    return new GetConsumerListByGroupResponseHeader();
};

module.exports = GetConsumerListByGroupResponseHeader;
