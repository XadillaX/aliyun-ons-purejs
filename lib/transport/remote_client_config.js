/**
 * XadillaX created at 2015-12-22 12:21:32 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var RemoteClientConfig = function() {
    this.clientWorkerThreads = require("os").cpus();
    this.clientCallbackExecutorThreads = this.clientWorkerThreads;
    this.clientSelectorThreads = 1;
    this.clientOnewaySemaphoreValue = 256;
    this.clientAsyncSemaphoreValue = 128;
    this.connectTimeoutMillis = 3000;

    this.channelNotActiveInterval = 1000 * 60;
    this.clientChannelMaxIdleTimeSeconds = 120;
};

module.exports = RemoteClientConfig;
