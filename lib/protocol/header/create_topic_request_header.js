/**
 * XadillaX created at 2015-12-21 16:15:40 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * CreateTopicRequestHeader
 * @constructor
 */
var CreateTopicRequestHeader = function() {
    CommonCustomerHeader.call(this);

    this.topic = "";
    this.defaultTopic = "";
    this.readQueueNums = -1;
    this.writeQueueNums = -1;
    this.perm = -1;
    this.topicFilterType = "";
};

util.inherits(CreateTopicRequestHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
CreateTopicRequestHeader.prototype.encode = function() {
    return new Buffer(JSON.stringify({
        topic: this.topic,
        defaultTopic: this.defaultTopic,
        readQueueNums: parseInt(this.readQueueNums),
        writeQueueNums: parseInt(this.writeQueueNums),
        perm: parseInt(this.perm),
        topicFilterType: this.topicFilterType
    }));
};

module.exports = CreateTopicRequestHeader;
