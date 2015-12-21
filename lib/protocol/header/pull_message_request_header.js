/**
 * XadillaX created at 2015-12-21 15:27:43 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var Long = require("long");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * PullMessageRequestHeader
 * @constructor
 */
var PullMessageRequestHeader = function() {
    CommonCustomerHeader.call(this);

    this.consumerGroup = "";
    this.topic = "";
    this.queueId = -1;
    this.queueOffset = new Long(0, 0);
    this.maxMsgNums = -1;
    this.sysFlag = -1;
    this.commitOffset = new Long(0, 0);
    this.suspendTimeoutMillis = new Long(0, 0);
    this.subscription = "";
    this.subVersion = new Long(0, 0);
};

util.inherits(PullMessageRequestHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
PullMessageRequestHeader.prototype.encode = function() {
    var jsonStr = JSON.stringify({
        consumerGroup: this.consumerGroup,
        topic: this.topic,
        queueId: parseInt(this.queueId),
        queueOffset: this.queueOffset.toString(),
        maxMsgNums: parseInt(this.maxMsgNums),
        sysFlag: parseInt(this.sysFlag),
        commitOffset: this.commitOffset.toString(),
        suspendTimeoutMillis: this.suspendTimeoutMillis.toString(),
        subscription: this.subscription,
        subVersion: this.subVersion().toString()
    });

    return new Buffer(jsonStr
        .replace(/"queueOffset"\s*:\s*"(\d+)"/, "\"queueOffset\":$1")
        .replace(/"commitOffset"\s*:\s*"(\d+)"/, "\"commitOffset\":$1")
        .replace(/"suspendTimeoutMillis"\s*:\s*"(\d+)"/, "\"suspendTimeoutMillis\":$1")
        .replace(/"subVersion"\s*:\s*"(\d+)"/, "\"subVersion\":$1"));
};

module.exports = PullMessageRequestHeader;