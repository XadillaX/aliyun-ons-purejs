/**
 * XadillaX created at 2015-12-21 16:35:13 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * GetConsumerListByGroupRequestHeader
 * @constructor
 */
var GetConsumerListByGroupRequestHeader = function() {
    CommonCustomerHeader.call(this);

    this.consumerGroup = "";
};

util.inherits(GetConsumerListByGroupRequestHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
GetConsumerListByGroupRequestHeader.prototype.encode = function() {
    return new Buffer(JSON.stringify({
        consumerGroup: this.consumerGroup
    }));
};

/**
 * decode
 * @param {Buffer} buff the buffer object
 * @return null
 */
GetConsumerListByGroupRequestHeader.decode = function(buff) { /* jshint ignore: line */
    return null;
};

module.exports = GetConsumerListByGroupRequestHeader;
