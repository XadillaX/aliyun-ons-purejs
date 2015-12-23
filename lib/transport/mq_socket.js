/**
 * XadillaX created at 2015-12-22 12:24:57 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var EventEmitter = require("events").EventEmitter;
var net = require("net");
var util = require("util");

var _ = require("lodash");

var RemotingCommand = require("../protocol/remoting_command");

var ConnectState = {
    CS_NOT_START: 0,
    CS_CONNECTING: 1,
    CS_DISCONNECTED: 2,
    CS_CONNECTED: 3
};

/**
 * MQSocket
 * @param {String} accessKey the access key
 * @param {String} secretKey the secret key
 * @param {String} onsChannel the ons channel
 * @param {Object} [options] the options
 * @param {Number} [options.connectTimeout] connect timeout
 * @param {Boolean} [options.reconnect] should it reconnected when error
 * @param {Number} [options.retryInterval] retry interval
 * @constructor
 */
var MQSocket = function(accessKey, secretKey, onsChannel, options) {
    EventEmitter.call(this);

    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.onsChannel = onsChannel;

    this.socket = null;

    this.options = _.merge(options || {}, {
        connectTimeout: 10000,
        reconnect: true,
        retryInterval: 1000
    });

    this.nextLength = -1;
    this.nextBuffer = null;

    this.state = ConnectState.CS_NOT_START;

    this.on("error", function() {});

    this.accumulation = [];
    this.calls = {};

    this.host;
    this.port;
};

util.inherits(MQSocket, EventEmitter);

/**
 * consumeAccumulation
 */
MQSocket.prototype.consumeAccumulation = function() {
    for(var i = 0; i < this.accumulation.length; i++) {
        var name = "sendC" + this.accumulation[i].substr(1);
        var args = this.accmulation[i].slice(1);
        this[name].apply(this, args);
    }

    this.accumulation = [];
};

/**
 * sendCall
 * @param {RemotingCommand} cmd the remoting command object
 * @param {Number} timeout the timeout
 * @param {Function} callback the callback function
 */
MQSocket.prototype.sendCall = function(cmd, timeout, callback) {
    if(!(cmd instanceof RemotingCommand)) {
        return process.nextTick(function() {
            var err = new Error("Command not an instance of RemotingCommand.");
            err.name = "MQSocketParamError";
            callback(err);
        });
    }

    if(this.state === ConnectState.CS_CONNECTING) {
        return this.accumulation.push([ "call", cmd, timeout, callback ]);
    } else if(this.state === ConnectState.CS_DISCONNECTED) {
        var err = new Error("Socket already disconnected.");
        err.name = "MQSocketDisconnectedError";
        return process.nextTick(function() {
            callback(err);
        });
    }

    if(cmd.isResponseType()) {
        this.socket.write(cmd.encode(this.accessKey, this.secretKey, this.onsChannel));
        return process.nextTick(function() {
            callback();
        });
    }

    // not response type...
    var opaque = cmd.opaque;
    var self = this;
    var timer = setTimeout(function() {
        delete self.calls[opaque];
        var err = new Error(
            "MQServer no response in " + timeout + "ms, " + self.host + ":" +
            self.port + ", req#" + opaque + ", command#" + cmd.code + ".");
        err.name = "MQRequestTimeoutError";
        callback(err);
    }, timeout);

    this.calls[opaque] = {
        callback: callback,
        timer: timer
    };

    this.socket.write(cmd.encode(this.accessKey, this.secretKey, this.onsChannel));
};

/**
 * sendCast
 * @param {RemotingCommand} cmd the remoting command object
 */
MQSocket.prototype.sendCast = function(cmd) {
    if(!(cmd instanceof RemotingCommand)) {
        return;
    }

    if(this.state === ConnectState.CS_CONNECTED) {
        return this.socket.write(cmd.encode(this.accessKey, this.secretKey, this.onsChannel));
    }

    this.accumulation.push([ "cast", cmd ]);
};

/**
 * splitAndProcessData
 */
MQSocket.prototype.splitAndProcessData = function() {
    while(this.nextBuffer && this.nextBuffer.length >= this.nextLength) {
        var tempBuffer = new Buffer(this.nextLength);
        this.nextBuffer.copy(tempBuffer, 0, 0, this.nextLength);

        if(this.nextBuffer.length - this.nextLength > 0) {
            var next = new Buffer(this.nextBuffer.length - this.nextLength);
            this.nextBuffer.copy(next, 0, this.nextLength);
            this.nextBuffer = next;
            this.nextLength = this.nextBuffer.readInt32BE(0) + 4;
        } else {
            this.nextLength = -1;
            this.nextBuffer = null;
        }

        var cmd = RemotingCommand.decode(tempBuffer);
        if(null === cmd) continue;
        if(cmd.isResponseType()) {
            var call = this.calls[cmd.opaque];
            if(call) {
                clearTimeout(call.timer);
                delete this.calls[cmd.opaque];
                call.callback(null, cmd);
                continue;
            }
        }

        this.emit("data", tempBuffer);
    }
};

/**
 * onData
 * @param {Buffer} data the data buffer
 */
MQSocket.prototype.onData = function(data) {
    if(this.nextLength === -1 && this.nextBuffer === null) {
        this.nextLength = data.readInt32BE(0) + 4;
        this.nextBuffer = data;
    } else {
        this.nextBuffer = Buffer.concat([ this.nextBuffer, data ], this.nextBuffer.length + data.length);
    }

    this.splitAndProcessData();
};

/**
 * onClose
 * @param {Boolean} hadError if had error
 */
MQSocket.prototype.onClose = function(hadError) {
    this.disconnect();

    if(hadError && this.options.reconnect) {
        this.reconnect();
    }

    this.emit("close", hadError);
};

/**
 * reconnect
 */
MQSocket.prototype.reconnect = function() {
    var self = this;
    this.emit("reconnecting");
    this.connect(function(err) {
        if(err) {
            if(err.message === "MQSocket is already connected.") {
                return;
            }

            self.emit("error", err);
            return setTimeout(self.reconnect.bind(self), self.options.retryInterval);
        }

        self.emit("reconnected");
    });
};

/**
 * connect
 * @param {String} [host] the server host
 * @param {Number} [port] the post number
 * @param {Function} callback the callback function
 */
MQSocket.prototype.connect = function() {
    var callback = function() {};
    var host = null;
    var port = null;
    for(var i = 0; i < arguments.length; i++) {
        if(typeof arguments[i] === "string") host = arguments[i];
        else
        if(typeof arguments[i] === "number") port = arguments[i];
        else
        if(typeof arguments[i] === "function") callback = arguments[i];
    }

    if(this.state === ConnectState.CS_CONNECTING) {
        return process.nextTick(function() {
            var err = new Error("MQSocket is connecting.");
            err.name = "MQSocketConnectError";
            callback(err);
        });
    }

    if(this.state === ConnectState.CS_CONNECTED) {
        return process.nextTick(function() {
            var err = new Error("MQSocket is already connected.");
            err.name = "MQSocketConnectError";
            callback(err);
        });
    }

    this.state = ConnectState.CS_CONNECTING;

    this.host = this.host || host;
    this.port = this.port || port;

    var self = this;
    var connectTimer = setTimeout(function() {
        self.disconnect();
        self.state = ConnectState.CS_DISCONNECTED;
        var err = new Error("MQSocket connect timeout after " + self.options.connectTimeout + "ms.");
        err.name = "MQSocketConnectError";
        callback(err);
    }, this.options.connectTimeout);

    this.socket = net.connect(port, host, function() {
        clearTimeout(connectTimer);

        self.socket.on("data", self.onData.bind(self));
        self.socket.on("close", self.onClose.bind(self));
        self.socket.on("error", function(err) {
            self.emit("error", err);
        });

        self.state = ConnectState.CS_CONNECTED;
        self.consumeAccumulation();
        callback();
    });
    this.socket.setNoDelay(true);
    this.socket.setKeepAlive(true);
};

/**
 * disconnect
 */
MQSocket.prototype.disconnect = function() {
    if(!this.socket) return;
    try {
        this.socket.end();
        this.socket.removeAllListeners();
        this.socket.destroy();
    } catch(e) {
        //...
    }

    this.socket = null;
    this.state = ConnectState.CS_DISCONNECTED;
};

module.exports = MQSocket;
MQSocket.ConnectState = ConnectState;
