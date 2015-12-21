/**
 * XadillaX created at 2015-12-21 16:27:43 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * SendMessageRequestHeader
 * @constructor
 */
var SendMessageRequestHeader = function() {
    CommonCustomerHeader.call(this);

    this.producerGroup = "";
    this.topic = "";
    this.defaultTopic = "";

    this.defaultTopicQueueNums = -1;
    this.queueId = -1;
    this.sysFlag = -1;

    this.bornTimestamp = -1;
    this.flag = -1;
    this.properties = "";
    this.reconsumeTimes = -1;
};

util.inherits(SendMessageRequestHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
SendMessageRequestHeader.prototype.encode = function() {
    return JSON.stringify({
        producerGroup: this.producerGroup,
        topic: this.topic,
        defaultTopic: this.defaultTopic,

        defaultTopicQueueNums: parseInt(this.defaultTopicQueueNums),
        queueId: parseInt(this.queueId),
        sysFlag: parseInt(this.sysFlag),

        bornTimestamp: parseFloat(this.bornTimestamp),
        flag: parseInt(this.flag),
        properties: this.properties,
        reconsumeTimes: parseInt(this.reconsumeTimes)
    });
};

module.exports = SendMessageRequestHeader;
