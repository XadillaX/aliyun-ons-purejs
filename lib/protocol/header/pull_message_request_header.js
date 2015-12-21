/**
 * XadillaX created at 2015-12-21 15:27:43 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var debug = require("debug")("pull_message_request_header");
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
        msgId: this.msgId,
        queueId: this.queueId,
        queueOffset: this.queueOffset.toString(),
        maxMsgNums: this.maxMsgNums,
        sysFlag: this.sysFlag,
        commitOffset: this.commitOffset.toString(),
        suspendTimeoutMillis: this.suspendTimeoutMillis.toString(),
        subscription: this.subscription(),
        subVersion: this.subVersion().toString()
    });

    return new Buffer(jsonStr
        .replace(/"queueOffset"\s*:\s*"(\d+)"/, "\"queueOffset\":$1")
        .replace(/"commitOffset"\s*:\s*"(\d+)"/, "\"commitOffset\":$1")
        .replace(/"suspendTimeoutMillis"\s*:\s*"(\d+)"/, "\"suspendTimeoutMillis\":$1")
        .replace(/"subVersion"\s*:\s*"(\d+)"/, "\"subVersion\":$1"));
};

/**
 * decode
 * @param {Buffer} buff the encoded buffer
 * @return {PullMessageRequestHeader} the send message header object
 */
PullMessageRequestHeader.decode = function(buff) {
    var jsonStr = buff.slice(8).toString();
    var object;
    jsonStr.replace(/"queueOffset"\s*:\s*(\d+)/, "\"queueOffset\":\"$1\"");

    try {
        object = JSON.parse(jsonStr);
    } catch(e) {
        debug(e);
        return null;
    }

    var ext = object.extFields;
    var sendMessageResponseHeader = new PullMessageRequestHeader();
    sendMessageResponseHeader.msgId = ext.msgId;
    sendMessageResponseHeader.queueId = parseInt(ext.queueId);
    sendMessageResponseHeader.queueOffset = Long.fromString(ext.queueOffset);

    return sendMessageResponseHeader;
};

module.exports = PullMessageRequestHeader;
