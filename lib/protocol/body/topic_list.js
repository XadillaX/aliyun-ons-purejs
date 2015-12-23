/**
 * XadillaX created at 2015-12-22 10:39:05 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var RemotingSerializable = require("../remoting_serializable");

/**
 * TopicList
 * @constructor
 */
var TopicList = function() {
    RemotingSerializable.call(this);
    this.topicList = {};
};

util.inherits(TopicList, RemotingSerializable);

module.exports = TopicList;
