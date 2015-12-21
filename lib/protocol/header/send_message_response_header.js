/**
 * XadillaX created at 2015-12-21 14:26:31 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var debug = require("debug")("send_message_response_header");
var Long = require("long");

var CommonCustomerHeader = require("./common_customer_header");

/**
 * SendMessageResponseHeader
 * @constructor
 */
var SendMessageResponseHeader = function() {
    CommonCustomerHeader.call(this);

    this.msgId = "";
    this.queueId = -1;
    this.queueOffset = new Long(0, 0);
};

util.inherits(SendMessageResponseHeader, CommonCustomerHeader);

/**
 * encode
 * @return {Buffer} the encoded buffer
 */
SendMessageResponseHeader.prototype.encode = function() {
    var json = JSON.stringify({
        msgId: this.msgId,
        queueId: parseInt(this.queueId)
    });

    // queue offset is long long,
    // so I must do like this...
    json = json.substr(0, json.length - 1);
    json += ",\"queueOffset\":" + this.queueOffset.toString() + "}";
    return new Buffer(json);
};

/**
 * decode
 * @param {Buffer} buff the encoded buffer
 * @return {SendMessageResponseHeader} the send message header object
 */
SendMessageResponseHeader.decode = function(buff) {
    var jsonStr = buff.slice(8).toString();
    var object;
    jsonStr = CommonCustomerHeader.decodeReplaceLonglong([
        "queueOffset"
    ]);

    try {
        object = JSON.parse(jsonStr);
    } catch(e) {
        debug(e);
        return null;
    }

    var ext = object.extFields;
    var header = new SendMessageResponseHeader();
    header.msgId = ext.msgId;
    header.queueId = parseInt(ext.queueId);
    header.queueOffset = Long.fromString(ext.queueOffset);

    return header;
};

module.exports = SendMessageResponseHeader;
