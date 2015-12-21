/**
 * XadillaX created at 2015-12-21 17:39:47 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var _ = require("./consume_type");

var ConsumerType = _.ConsumerType;
var MessageModel = _.MessageModel;
var ConsumeFromWhere = _.ConsumeFromWhere;

/**
 * ConsumerData
 * @constructor
 */
var ConsumerData = function() {
    this.groupName = "";
    this.consumerType = ConsumerType.CONSUME_PASSIVELY;
    this.messageModel = MessageModel.CLUSTERING;
    this.consumeFromWhere = ConsumeFromWhere.CONSUME_FROM_LAST_OFFSET_AND_FROM_MIN_WHEN_BOOT_FIRST;
    this.subscriptionData = null;
};

/**
 * smallerThan
 * @param {ConsumerData} a the object
 * @param {ConsumerData} b the other
 * @return {Boolean} is a smaller than b
 */
ConsumerData.smallerThan = function(a, b) {
    return a.groupName < b.groupName;
};

module.exports = ConsumerData;
