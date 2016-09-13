/**
 * XadillaX created at 2016-09-12 11:42:40 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const async = require("async");
const debug = require("debug")("ons:base_client");
const spidex = require("spidex");

const Authority = require("./authority");
const helper = require("../helper");
const CONST = require("../constants");

function _fetchNameServer(gateway, timeout, callback) {
    spidex.get(gateway, {
        header: {
            "User-Agent": CONST.COMMON.SPIDEX_USER_AGENT
        },
        timeout: timeout
    }, function(html, status) {
        if(status !== 200) {
            return callback(
                new Error(`Gateway server ${gateway} returns a wrong status ${status} with [${html}].`));
        }

        return callback(undefined, html.trim());
    }).on("error", callback);
}

class ONSBaseClient {
    /**
     * ONSBaseClient constructor
     * @param {String} accessKey the access key
     * @param {String} secretKey the secret key
     * @param {Object} options the opitons
     */
    constructor(accessKey, secretKey, options) {
        options = options || {};

        this.authority = new Authority(accessKey, secretKey, options.channel);
        this.options = options;
        this.nameServer = "";
        this.instanceName = "";
    }

    /**
     * Fetch name server address
     *
     * @brief
     *   1. fetch from `options.gateway` if exist
     *   2. fetch from internal address until timeout
     *   3. fetch from internet address if internal timeout
     *
     * @param {Function} callback the callback function
     */
    fetchNameServer(callback) {
        const self = this;

        let fetched = false;
        let address = "";
        async.waterfall([
            function(callback) {
                if(!self.options.gateway) return callback();
                _fetchNameServer(self.options.gateway, 5000, function(err, addr) {
                    if(err) return callback(err);
                    fetched = true;
                    address = addr;
                    callback();
                });
            },

            function(callback) {
                if(fetched) return callback();
                _fetchNameServer(CONST.GATEWAY.INTERNAL, 3000, function(err, addr) {
                    if(err) {
                        debug(`failed to fetch name server from ${CONST.GATEWAY.INTERNAL}: ${err.message}`);
                        return callback();
                    }

                    fetched = true;
                    address = addr;
                    callback();
                });
            },

            function(callback) {
                if(fetched) return callback();
                _fetchNameServer(CONST.GATEWAY.INTERNET, 5000, function(err, addr) {
                    if(err) return callback(err);
                    fetched = true;
                    address = addr;
                    callback();
                });
            }
        ], function(err) {
            if(err) {
                debug(`failed to fetch name server: ${err.message}`);
                return callback(err);
            }

            self.nameServer = address;
            self.instanceName = `${process.pid}#${helper.hash(self.nameServer)}#` +
                `${helper.hash(self.authority.accessKey)}#${helper.nanoTime()}`;
            return callback(undefined, address);
        });
    }
}

module.exports = ONSBaseClient;
