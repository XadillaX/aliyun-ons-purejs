/**
 * XadillaX created at 2015-12-21 17:23:13 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var Long = require("long");

/**
 * SubscriptionData
 * @param {String} [topic] the topic
 * @param {String} [subString] the substring
 * @constructor
 */
var SubscriptionData = function(topic, subString) {
    this.topic = topic || "";
    this.subString = subString || "";

    this.tagsSet = {};
    this.codeSet = {};

    this.subVersion = new Long(0, 0);
};

/**
 * equal
 * @param {SubscriptionData} a the object
 * @param {SubstriptionData} b the other
 * @return {Boolean} whether they are equaling
 */
SubscriptionData.equal = function(a, b) {
    if(a.topic !== b.topic) return false;
    if(a.subString !== b.subString) return false;
    if(!(a.subVersion instanceof Long) || !(b.subVersion instanceof Long)) {
        return false;
    }
    if(!a.equals(b)) return false;

    if(Object.keys(a.tagsSet).length !== Object.keys(b.tagsSet).length) {
        return false;
    }

    if(Object.keys(a.codeSet).length !== Object.keys(b.codeSet).length) {
        return false;
    }

    for(var key in a.tagsSet) {
        if(!a.tagsSet.hasOwnProperty(key)) continue;
        if(a.tagsSet[key] !== b.tagsSet[key]) return false;
    }

    for(var key in a.codeSet) {
        if(!a.codeSet.hasOwnProperty(key)) continue;
        if(a.codeSet[key] !== b.codeSet[key]) return false;
    }

    return true;
};

/**
 * smallerThan
 *
 * @param {SubscriptionData} a the object
 * @param {SubscriptionData} b the other
 * @return {Boolean} is a small than b
 */
SubscriptionData.smallerThan = function(a, b) {
    if(a.topic < b.topic) {
        return true;
    } else if(a.topic === b.topic) {
        if(a.subString < b.subString) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

module.exports = SubscriptionData;
