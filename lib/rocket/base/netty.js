/**
 * XadillaX created at 2016-09-12 17:15:52 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const EventEmitter = require("events").EventEmitter;
const net = require("net");

const debug = require("debug")("ons:rocket:netty");

const STATUS = {
    NOT_ACTIVE: 0,
    ACTIVING: 1,
    ACTIVE: 2
};

class RocketNet extends EventEmitter {
    constructor(nameServer) {
        super();

        this.nameServers = nameServer.split(";");

        this.started = false;

        this.addrIdx = -1;
        this.socket = null;
        this.connectedAt = 0;
        this.active = STATUS.NOT_ACTIVE;

        // cumulate messages...
        this.cumulate = [];
    }

    start() {
        this.started = true;
        this._connect();
    }

    stop() {
        const old = this.socket;
        this.socket = null;
        this.active = STATUS.NOT_ACTIVE;
        this.started = false;

        if(!old) return;

        old.removeAllListeners();
        try {
            old.end();
            old.destroy();
        } catch(e) {
            // ...
        }
    }

    _reconnect() {
        const old = this.socket;
        this.socket = null;
        if(!old) return;

        this.active = STATUS.NOT_ACTIVE;
        old.removeAllListeners();
        try {
            old.end();
            old.destroy();
        } catch(e) {
            //...
        }

        const interval = new Date() - this.connectedAt;
        const self = this;
        if(interval >= 1000) {
            return this._connect();
        } else {
            return setTimeout(function() {
                self._connect();
            }, interval);
        }
    }

    _connect() {
        if(this.active !== STATUS.NOT_ACTIVE || !this.started) return;

        this.active = STATUS.ACTIVING;
        this.addrIdx = (this.addrIdx + 1) % this.nameServers.length;
        const addr = this.nameServers[this.addrIdx].split(":");
        if(addr.length === 1) addr.push(80);

        debug(`connecting with ${addr[0]}:${addr[1]}...`);
        const socket = new net.connect({
            host: addr[0],
            port: addr[1]
        });
        socket.setNoDelay(true);
        socket.setKeepAlive(true);

        const self = this; 
        const timer = setTimeout(function() {
            socket.emit("error", new Error("connect timeout."));
        }, 5000);

        socket.once("connect", function() {
            clearTimeout(timer);

            debug(`${addr[0]}:${addr[1]} connected.`);
            self.socket = socket;
            self.connectedAt = new Date();
            self.active = STATUS.ACTIVE;
            self.doCumulate();
        });

        socket.on("close", function(hadError) {
            debug(`socket stopped with ${hadError ? "" : "no "}error.`);
            if(!self.started) return;
            self._reconnect();
        });

        socket.on("error", function(err) {
            debug("socket stopped with an error.", err);
            if(!self.started) return;
            self._reconnect();
        });

        socket.on("data", function(data) {
            console.log(data);
        });
    }

    doCumulate() {
        const cumulate = this.cumulate;
        this.cumulate = [];

        for(let i = 0; i < cumulate.length; i++) {
            const item = cumulate[i];
            this[item.type](item.req, item.timeout, item.callback);
        }
    }

    send(req, timeout, callback) {
        if(this.active !== STATUS.ACTIVE) {
            return this.cumulate.push({ type: "send", req: req, timeout: timeout, callback: callback });
        }

        debug("sending", req);
        this.socket.write(req.encode());
    }

    cast(req, timeout, callback) {
        if(this.active !== STATUS.ACTIVE) {
            return this.cumulate.push({ type: "cast", req: req, timeout: timeout, callback: callback });
        }
    }
}

RocketNet.STATUS = STATUS;

module.exports = RocketNet;
