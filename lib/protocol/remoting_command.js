/**
 * XadillaX created at 2015-12-21 17:53:33 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var crypto = require("crypto");
var util = require("util");

var debug = require("debug")("remoting_command");

var CommonCustomerHeader = require("./header/common_customer_header");
var RemotingCommandEnum = require("../enum/remoting_command");
var versions = require("../../version");

var SEQ_NUMBER = 0;
var CONFIG_VERSION = versions.versions.indexOf(versions.current);

var RPC_TYPE = 0;
var RPC_ONEWAY = 1;

/**
 * RemotingCommand
 * @param {Number} code the code
 * @param {String} [language] the language
 * @param {Number} [version] the version
 * @param {Number} [opaque] the opaque
 * @param {Number} [flag] the flag
 * @param {String} [remark] the remark
 * @param {CommandCustomHeader} [header] the header
 * @constructor
 */
var RemotingCommand = function(code, language, version, opaque, flag, remark, header) {
    this.code = code;
    this.language = language || "Node.js";
    this.version = version || 0;
    this.opaque = opaque || (SEQ_NUMBER++);
    this.flag = flag || 0;
    this.remark = remark || "";
    this.header = header || null;

    // ... something
    this.headLen = 0;
    this.bodyLen = 0;
    this.buf = null;
    this.head = null;
    this.body = null;

    SEQ_NUMBER %= 2147483647;
};

RemotingCommand.prototype.genSignature = function(accessKey, secretKey, onsChannel) {
    var header = this.header;
    var map = {
        AccessKey: accessKey,
        OnsChannel: onsChannel
    };

    if(header) {
        for(var key in header) {
            if(!header.hasOwnProperty(key)) continue;
            if(header[key] === null || header[key] === undefined) continue;
            if(typeof header[key] === "function") continue;
            if(typeof header[key].toString() === "function") {
                map[key] = header[key].toString();
            } else {
                map[key] = header[key];
            }
        }
    }

    var val = "";
    var keys = Object.keys(map).sort();
    for(var i = 0; i < keys.length; i++) {
        val += map[keys[i]];
    }
    var total = Buffer.concat([ new Buffer(val, "utf8"), this.body || new Buffer([]) ]);
    var signature = crypto.createHmac("sha1", secretKey);
    signature.update(total).digest("base64");
    return signature;
};

/**
 * encode
 */
RemotingCommand.prototype.encode = function(accessKey, secretKey, onsChannel) {
    var extHeader = this.header.encode();
    var jsonString = JSON.stringify({
        code: parseInt(this.code),
        language: this.language,
        version: parseInt(this.version),
        opaque: parseInt(this.opaque),
        flag: parseInt(this.flag),
        remark: this.remark
    });

    // add signature
    var signature = this.genSignature(secretKey);
    extHeader = extHeader.substr(0, extHeader.length - 1);
    extHeader += util.format(
        ",\"Signature\":\"%s\",\"AccessKey\":\"%s\",\"OnsChannel\":\"%s\"}",
        signature, accessKey, onsChannel);

    jsonString = jsonString.substr(0, jsonString.length - 1);
    jsonString += ",\"extFields:\":" + extHeader + "}";

    var headBuf = new Buffer(jsonString);

    this.headLen = headBuf.length + 4 + 4;
    this.buf = new Buffer(this.headLen);
    this.buf.writeInt32BE(this.headLen + this.bodyLen - 4, 0);
    this.buf.writeInt32BE(this.headLen, 4);
    headBuf.copy(this.buf, 8);

    this.head = this.buf;
};

/**
 * markResponseType
 */
RemotingCommand.prototype.markResponseType = function() {
    var bits = 1 << RPC_TYPE;
    this.flag |= bits;
};

/**
 * isResponseType
 * @return {Boolean} is response type
 */
RemotingCommand.prototype.isResponseType = function() {
    var bits = 1 << RPC_TYPE;
    return (this.flag & bits) === bits;
};

/**
 * markOnewayRPC
 */
RemotingCommand.prototype.markOnewayRPC = function() {
    var bits = 1 << RPC_ONEWAY;
    this.flat |= bits;
};

/**
 * isOnewayRPC
 * @return {Boolean} is oneway RPC
 */
RemotingCommand.prototype.isOnewayRPC = function() {
    var bits = 1 << RPC_ONEWAY;
    return (this.flag & bits) === bits;
};

/**
 * markCustomHeader
 * @param {Number} code the code
 * @param {Buffer} buff the buffer data
 */
RemotingCommand.prototype.markCustomHeader = function(code, buff) {
    var p = buff.slice(8);
    var header = CommonCustomerHeader.decode(code, p, this.isResponseType());
    this.header = header;
};

/**
 * getType
 * @return {RemotingCommandEnum} the remoting command type
 */
RemotingCommand.prototype.getType = function() {
    return (this.isResponseType()) ? 
        RemotingCommandEnum.RESPONSE_COMMAND :
        RemotingCommandEnum.REQUEST_COMMAND;
};

/**
 * decode
 * @param {Buffer} buff the buffer
 * @return {RemotingCommand} the remoting command object
 */
RemotingCommand.decode = function(buff) {
    var json;

    try {
        json = JSON.stringify(buff.slice(8).toString());
    } catch(e) {
        debug(e);
        return null;
    }

    var code = parseInt(json.code);
    var language = json.language;
    var version = parseInt(json.version);
    var opaque = parseInt(json.opaque);
    var flag = parseInt(json.flag);
    var remark = json.remark || "";

    var cmd = new RemotingCommand(code, language, version, opaque, flag, remark, null);
    var headLen = buff.readInt32LE(4);
    var bodyLen = buff.length - 8 - headLen;
    if(bodyLen > 0) {
        cmd.body = new Buffer(bodyLen);
        buff.copy(cmd.body, 8 + headLen);
    }

    return cmd;
};

/**
 * createRemotingCommand
 * @param {Buffer} buff the buffer object
 * @return {RemotingCommand} the remoting command object
 */
RemotingCommand.createRemotingCommand = function(buff) {
    var cmd = RemotingCommand.decode(buff);
    return cmd;
};

/**
 * createRequestCommand
 * @param {Number} code the code
 * @param {CommandCustomHeader} header the customer header
 */
RemotingCommand.createRequestCommand = function(code, header) {
    var cmd = new RemotingCommand(code);
    cmd.header = header;
    cmd.version = CONFIG_VERSION;
};

module.exports = RemotingCommand;
