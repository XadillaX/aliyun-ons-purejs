/**
 * XadillaX created at 2015-12-21 16:04:58 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * GetRouterInfoRequestHeader
 * @constructor
 */
var GetRouterInfoRequestHeader = function() {
    CommonCustomerHeader.call(this);

    this.topic = "";
};

util.inherits(GetRouterInfoRequestHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
GetRouterInfoRequestHeader.prototype.encode = function() {
    return JSON.stringify({
        topic: this.topic
    });
};

module.exports = GetRouterInfoRequestHeader;
