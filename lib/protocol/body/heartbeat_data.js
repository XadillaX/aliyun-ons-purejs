/**
 * XadillaX created at 2015-12-21 16:59:16 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var RemotingSerializable = require("../remoting_serializable");

/**
 * HeartbeatData
 * @constructor
 */
var HeartbeatData = function() {
    RemotingSerializable.call(this);

    this.clientId = "";
    this.producerDataSet = [];
    this.consumerDataSet = [];
};

util.inherits(HeartbeatData, RemotingSerializable);

module.exports = HeartbeatData;
