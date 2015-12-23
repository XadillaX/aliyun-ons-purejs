/**
 * XadillaX created at 2015-12-22 11:32:46 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var CppUtil = require("../build/Release/cpp_util");
var MixAll = require("./mix_all");

/**
 * ClientConfig
 * @constructor
 */
var ClientConfig = function() {
    this.clientCallbackExecutorThreads = require("os").cpus();
    this.pollNameServerInterval = 1000 * 30;
    this.heartbeatBrokerInterval = 1000 * 30;
    this.persistConsumerOffsetInterval = 1000 * 5;

    this.namesrvAddr = process.env[MixAll.NAMESRV_ADDR_ENV] || "";
    this.clientIP = CppUtil.getLocalAddress();
    this.instanceName = "DEFAULT";
};

/**
 * buildMQClientId
 * @return {String} the built mq client id
 */
ClientConfig.prototype.buildMQClientId = function() {
    return this.clientIP + "@" + this.instanceName;
};

/**
 * resetClientConfig
 * @param {ClientConfig} cc the client config object
 */
ClientConfig.prototype.resetClientConfig = function(cc) {
    this.namesrvAddr = cc.namesrvAddr;
    this.clientIP = cc.clientIP;
    this.instanceName = cc.instanceName;
    this.clientCallbackExecutorThreads = cc.clientCallbackExecutorThreads;
    this.pollNameServerInterval = cc.pollNameServerInterval;
    this.heartbeatBrokerInterval = cc.heartbeatBrokerInterval;
    this.persistConsumerOffsetInterval = cc.persistConsumerOffsetInterval;
};

module.exports = ClientConfig;
