/**
 * XadillaX created at 2015-12-22 17:29:02 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var EventEmitter = require("events").EventEmitter;
var util = require("util");

var _ = require("lodash");
var async = require("async");
var spidex = require("spidex");

var MixAll = require("../mix_all");
var MQSocket = require("../transport/mq_socket");

var MQPool = function(accessKey, secretKey, options) {
    EventEmitter.call(this);

    this.options = _.merge(options || {}, {
        connectTimeout: 10000,
        reconnect: false,
        retryInterval: 1000
    });
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.channel = this.options.channel || "ALIYUN";

    this.destroyed = false;
    this.clients = {};
    this.accumulation = [];

    this.newConnectionsIng = false;

    this.on("error", function() {});

    this.newConnections(function() {});
};

util.inherits(MQPool, EventEmitter);

MQPool.prototype.newConnections = function(callback) {
    var self = this;

    if(this.newConnectionsIng) {
        return process.nextTick(function() {
            callback();
        });
    }

    this.newConnectionsIng = true;
    if(undefined === callback) callback = function() {};

    if(this.destroyed) {
        return process.nextTick(function() {
            self.newConnectionsIng = false;
            var err = new Error("This pool has been destroyed.");
            err.name = "MQPoolDestroyedError";
            self.emit("error", err);
            return callback(err);
        });
    }

    spidex.get(MixAll.WSADDR_INTERNET, {
        timeout: this.options.connectTimeout
    }, function(html, status) {
        if(200 !== status) {
            self.newConnectionsIng = false;
            var err = new Error(
                "Error status code " + status + " While fetching Ali-ONS Address.");
            err.name = "MQPoolAddrFetchError";
            callback(err);
            return self.emit("error", err);
        }

        var addrs = html.trim().split("\n");
        async.eachLimit(addrs, 10, function(addr, callback) {
            self.newConnection(addr, callback);
        }, function(err) {
            self.newConnectionsIng = false;
            if(err) {
                self.emit("error", err);
                return callback(err);
            }

            self.emit("news");
            callback();
        });
    });
};

MQPool.prototype.newConnection = function(_addr, callback) {
    var addr = _addr.split(":");
    if(addr.length < 2) {
        return process.nextTick(function() {
            var err = new Error("Bad remote address " + _addr + ".");
            err.name = "MQPoolBadRemoteAddrError";
            callback(err);
        });
    }

    if(this.clients[_addr]) {
        var client = this.clients[_addr];
        return process.nextTick(function() {
            callback(undefined, client);
        });
    }

    var self = this;
    
    var client = new MQSocket(this.accessKey, this.secretKey, this.channel, this.options);

    var clientError = function(err) {
        self.emit("error", err);

        if(client === self.clients[_addr]) delete self.clients[_addr];
        client.disconnect();

        // accumulation
        for(var i = 0; i < client.accumulation.length; i++) {
            self.accumulation.push(client.accumulation[i]);
        }

        client.accumulation = [];

        self.newConnections(function() {});
    };

    this.clients[_addr] = client;
    client.connect(addr[0], parseInt(addr[1]), function(err) {
        if(err) {
            client.disconnect();
            clientError(err);
            return callback(err);
        }

        // accumulation
        for(var i = 0; i < self.accumulation.length; i++) {
            var temp = self.accumulation[i];
            var method = temp.shift();
            self['sendC' + method].apply(self, temp);
        }
        self.accumulation = [];

        callback();
    });

    client.on("error", clientError);
    client.$tasks = 0;
    client.$send = client.sendCall;
    client.$cast = client.sendCast;
    client.sendCall = (function(cmd, timeout, callback) {
        var self = this;
        this.$tasks++;
        this.$send(cmd, timeout, function() {
            self.$tasks--;
            callback.apply(null, arguments);
        });
    }).bind(client);
    client.sendCast = (function(cmd, callback) {
        var self = this;
        this.$tasks++;
        this.$cast(cmd, function() {
            self.$tasks--;
            callback.apply(null, arguments);
        });
    }).bind(client);
    client.$addr = _addr;
};

MQPool.prototype.getConnection = function(callback) {
    var client = null;
    var self = this;
    for(var key in self.clients) {
        if(!self.clients.hasOwnProperty(key)) continue;
        var _client = self.clients[key];
        if(_client.state !== MQSocket.ConnectState.CS_CONNECTED) continue;

        if(!client) {
            client = _client;
        } else if(_client.$tasks <= client.$tasks) {
            client = _client;
        }
    }

    if(client) {
        return process.nextTick(function() {
            callback(undefined, client);
        });
    }

    this.newConnections(function(err) {
        if(err) return callback(err);
        self.getConnection(callback);
    });
};

MQPool.prototype.sendCast = function(cmd, _callback) {
    this.sendCall(cmd, 0, _callback, true);
};

MQPool.prototype.sendCall = function(cmd, timeout, _callback) {
    if(this.destroyed) {
        return process.nextTick(function() {
            var err = new Error("This pool has been destroyed.");
            err.name = "MQPoolDestroyedError";
            _callback(err);
        });
    }

    var argv = arguments;
    var isCast = false;

    var _client;
    var self = this;
    async.waterfall([
        function(callback) {
            self.getConnection(function(err, client) {
                if(err) return callback(err);
                callback(undefined, client);
            });
        },
        function(client, callback) {
            _client = client;

            if(argv.length >= 4) {
                isCast = !!argv[3];
            }

            if(isCast) {
                client.sendCast(cmd, callback);
            } else {
                client.sendCall(cmd, timeout, callback);
            }
        }
    ], function(err, data) {
        _callback(err, data, _client);
    });
};

MQPool.prototype.destroy = function() {
    for(var key in this.clients) {
        if(!this.clients.hasOwnProperty(key)) continue;
        var conn = this.clients[key];
        conn.removeAllListeners();
        conn.close();
    }

    this.clients = {};
    this.destroyed = true;
};

module.exports = MQPool;
