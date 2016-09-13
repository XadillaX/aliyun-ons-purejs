/**
 * XadillaX created at 2016-09-13 10:45:38 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const _ = require("lodash");
const ByteBuffer = require("byte");
const bytes = require("bytes");

const BUFF = new ByteBuffer({ size: bytes("1m") });
const RPC_TYPE = {
    REQUEST: 0,
    RESPONSE: 1,
    ONEWAY: 2
};

let CURRENT_OPAQUE = 0;

class RocketPacket {
    constructor(code, options) {
        this.code = code;
        this.customHeader = options.customHeader || {};
        this.flag = options.flag || 0;
        this.opaque = options.opaque || (CURRENT_OPAQUE = (CURRENT_OPAQUE + 1 % 2147483647));
        this.remark = options.remark || "";
        this.extFields = options.extFields || {};
        this.body = null;

        Object.defineProperties(this, {
            language: {
                enumerable: true,
                configurable: false,
                writable: false,
                value: "NODEJS"
            },
            version: {
                enumerable: true,
                configurable: false,
                writable: false,
                value: 1
            }
        });
    }

    buildHeader() {
        const ext = Object.keys(this.customHeader).reduce((res, current) => {
            if(!this.customHeader[current]) return res;
            res[current] = this.customHeader[current];
            return res;
        }, _.cloneDeep(this.extFields));

        return new Buffer(JSON.stringify({
            code: this.code,
            extFields: ext,
            flag: this.flag,
            language: this.language,
            opaque: this.opaque,
            version: this.version,
            remark: this.remark
        }), "utf8");
    }

    encode() {
        BUFF.reset();

        const header = this.buildHeader();
        const length = 4 + header.length + (this.body ? this.body.length : 0);

        BUFF.putInt(length);
        BUFF.putInt(header.length);
        BUFF.put(header);
        if(this.body) {
            BUFF.put(this.body);
        }
        return BUFF.copy();
    }

    static decode(bin) {
        BUFF.reset();

        BUFF.put(bin);
        BUFF.flip();

        const length = BUFF.getInt();
        const headerLength = BUFF.getInt();
        const bodyLength = length - 4 - headerLength;

        const header = new Buffer(headerLength);
        BUFF.get(header);

        let body = null;
        if(bodyLength > 0) {
            body = new Buffer(bodyLength);
            BUFF.get(body);
        }

        const packet = new RocketPacket(header.code, header);
        packet.body = body;

        return packet;
    }

    static createRequest(code, customHeader) {
        return new RocketPacket(code, {
            customHeader: customHeader
        });
    }

    static createResponse(code, opaque, remark) {
        const packet = new RocketPacket(code, {
            opaque: opaque,
            remark: remark || "not set any response code"
        });
        packet.markAsResponse();
        return packet;
    }

    get type() {
        return this.isResponse() ? "RESPONSE" : "REQUEST";
    }

    isRequest() {
        return this.flag === RPC_TYPE.REQUEST;
    }

    isResponse() {
        return this.flag === RPC_TYPE.RESPONSE;
    }

    isOneway() {
        return this.flag === RPC_TYPE.ONEWAY;
    }

    markAsResponse() {
        this.flag = RPC_TYPE.RESPONSE;
    }

    markAsOneway() {
        this.flag = RPC_TYPE.ONEWAY;
    }
}

module.exports = RocketPacket;
