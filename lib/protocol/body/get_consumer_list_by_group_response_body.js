/**
 * XadillaX created at 2015-12-21 16:56:02 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var RemotingSerializable = require("../remoting_serializable");

/**
 * GetConsumerListByGroupResponseBody
 * @constructor
 */
var GetConsumerListByGroupResponseBody = function() {
    RemotingSerializable.call(this);
    this.consumerIdList = [];
};

util.inherits(GetConsumerListByGroupResponseBody, RemotingSerializable);

module.exports = GetConsumerListByGroupResponseBody;
