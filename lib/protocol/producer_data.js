/**
 * XadillaX created at 2015-12-21 17:48:08 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

/**
 * ProducerData
 * @param {String} [groupName] the group name
 * @constructor
 */
var ProducerData = function(groupName) {
    this.groupName = groupName || "";
};

/**
 * smallerThan
 * @param {ProducerData} a the object
 * @param {ProducerData} b the other
 * @return {Boolean} is a smaller than b
 */
ProducerData.smallerThan = function(a, b) {
    return a.groupName < b.groupName;
};

module.exports = ProducerData;
