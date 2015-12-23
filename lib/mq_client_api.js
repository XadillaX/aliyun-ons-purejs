/**
 * XadillaX created at 2015-12-22 12:20:13 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var _ = require("lodash");
var spidex = require("spidex");

var MixAll = require("./mix_all");
var MQSocket = require("./transport/mq_socket");

var MQClientAPI = function(accessKey, secretKey, options) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.options = _.merge(options || {}, {
        connectTimeout: 10000,
        reconnect: true,
        retryInterval: 1000
    });

    this.sockets = {};
};

MQClientAPI.prototype.start = function(callback) {
    spidex.get(MixAll.WSADDR_INTERNET, {
        timeout: this.options.connectTimeout
    }, function(html, status) {
        if(200 !== status) {
            var err = new Error(
                "Error status code " + status + " While fetching Ali-ONS Address.");
            err.name = "MQAddrFetchError";
            return callback(err);
        }
    });
};

module.exports = MQSocket;
