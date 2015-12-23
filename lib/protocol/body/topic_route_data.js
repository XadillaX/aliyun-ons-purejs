/**
 * XadillaX created at 2015-12-22 10:40:45 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var debug = require("debug")("topic_route_data");

var MixAll = require("../../mix_all");
var RemotingSerializable = require("../remoting_serializable");

/**
 * QueueData
 * @constructor
 */
var QueueData = function() {
    this.brokerName = "";
    this.readQueueNums = -1;
    this.writeQueueNums = -1;
    this.perm = -1;
};

/**
 * smallerThan
 * @param {QueueData} a the queue data object
 * @param {QueueData} b the other
 * @return {Boolean} is a smaller than b
 */
QueueData.smallerThan = function(a, b) {
    return a.brokerName < b.brokerName;
};

/**
 * equal
 * @param {QueueData} a the object
 * @param {QueueData} b the other
 * @return {Boolean} is a equal to b
 */
QueueData.equal = function(a, b) {
    return (a.brokerName === b.brokerName &&
        a.readQueueNums === b.readQueueNums &&
        a.writeQueueNums === b.writeQueueNums &&
        a.perm === b.perm);
};

/**
 * BrokerData
 * @constructor
 */
var BrokerData = function() {
    this.brokerName = -1;
    this.brokerAddrs = {};
};

/**
 * smallerThan
 * @param {BrokerData} a the object
 * @param {BrokerData} b the other
 * @return {Boolean} is a smaller than b
 */
BrokerData.smallerThan = function(a, b) {
    return a.brokerName < b.brokerName;
};

/**
 * equal
 * @param {BrokerData} a the object
 * @param {BrokerData} b the other
 * @return {Boolean} is a equal to b
 */
BrokerData.equal = function(a, b) {
    if(a.brokerName !== b.brokerName) return false;
    if(Object.keys(a.brokerAddrs).length !== Object.keys(b.brokerAddrs).length) return false;
    for(var key in a.brokerAddrs) {
        if(!a.brokerAddrs.hasOwnProperty(key)) continue;
        if(a.brokerAddrs[key] !== b.brokerAddrs[key]) return false;
    }
    return true;
};

/**
 * TopicRouteData
 * @constructor
 */
var TopicRouteData = function() {
    RemotingSerializable.call(this);

    this.orderTopicConf = "";
    this.queueDatas = [];
    this.brokerDatas = [];
};

util.inherits(TopicRouteData, RemotingSerializable);

/**
 * decode
 * @param {Buffer} buff the buffer
 * @return {TopicRouterData} the topic route data to be returned
 */
TopicRouteData.decode = function(buff) {
    var object;
    try {
        object = JSON.parse(buff.toString());
    } catch(e) {
        debug(e);
        return null;
    }

    var trd = new TopicRouteData();
    trd.orderTopicConf = object.orderTopicConf;

    var qds = object.queueDatas;
    for(var i = 0; i < qds.length; i++) {
        var d = new QueueData();
        d.brokerName = qds[i].brokerName;
        d.readQueueNums = parseInt(qds[i].readQueueNums);
        d.writeQueueNums = parseInt(qds[i].writeQueueNums);
        d.perm = parseInt(qds[i].perm);

        trd.queueDatas.push(d);
    }

    var bds = object.brokerDatas;
    for(var i = 0; i < bds.length; i++) {
        var d = new BrokerData();
        d.brokerName = bds[i].brokerName;
        d.brokerAddrs = bds[i].brokerAddrs;

        trd.brokerDatas.push(d);
    }

    return trd;
};

/**
 * selectBrokerAddr
 * @param {Object} data the broker map
 * @return {String} the broker name
 */
TopicRouteData.selectBrokerAddr = function(data) {
    var first = true;
    var maybeSlave = "";
    for(var key in data.brokerAddrs) {
        if(!data.brokerAddrs.hasOwnProperty(key)) continue;
        if(MixAll.MASTER_ID === data.brokerAddrs[key]) {
            return MixAll.MASTER_ID;
        }
        if(first) {
            maybeSlave = data.brokerAddrs[key];
            first = false;
        }
    }

    return maybeSlave;
};

/**
 * equal
 * @param {TopicRouteData} a the object
 * @param {TopicRouteData} b the other
 * @return {Boolean} is a equal to b
 */
TopicRouteData.equal = function(a, b) {
    if(a.orderTopicConf !== b.orderTopicConf) return false;
    if(a.queueDatas.length !== b.queueDatas.length) return false;
    if(a.brokerDatas.length !== b.brokerDatas.length) return false;
    for(var i = 0; i < a.queueDatas.length; i++) {
        if(!QueueData.equal(a.queueDatas[i], b.queueDatas[i])) return false;
    }
    for(var i = 0; i < a.brokerDatas.length; i++) {
        if(!BrokerData.equal(a.brokerDatas[i], b.brokerDatas[i])) return false;
    }

    return true;
};

module.exports = TopicRouteData;
TopicRouteData.QueueData = QueueData;
