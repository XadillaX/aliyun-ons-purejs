/**
 * XadillaX created at 2016-09-13 14:02:15 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const BaseClient = require("./base_client");
const CODE = require("./code");
const Netty = require("./netty");
const Packet = require("./packet");

class RocketClient extends BaseClient {
    constructor(nameServers) {
        super();
        this.sock = new Netty(nameServers);
    }

    get started() {
        return this.sock.started;
    }

    get status() {
        return this.sock.status;
    }

    start() {
        this.sock.start();
    }

    stop() {
        this.sock.stop();
    }

    getConfig(namespace, key, callback) {
        const header = {
            namespace: namespace,
            key: key
        };

        const req = Packet.createRequest(CODE.REQUEST.GET_KV_CONFIG_BY_VALUE, header);
        this.sock.send(req, 3000, function(err, resp) {
        });
    }
}

RocketClient.STATUS = Netty.STATUS;

module.exports = RocketClient;
