/**
 * XadillaX created at 2015-12-21 17:51:48 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var RemotingSerializable = require("../remoting_serializable");

/**
 * KVTable
 * @constructor
 */
var KVTable = function() {
    RemotingSerializable.call(this);
    this.table = {};
};

util.inherits(KVTable, RemotingSerializable);

module.exports = KVTable;
