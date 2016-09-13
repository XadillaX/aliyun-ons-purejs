/**
 * XadillaX created at 2016-09-12 15:53:16 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const ONSBaseClient = require("./base/base_client");

class ONSConsumer extends ONSBaseClient {
    constructor(consumerId, topic, tags, accessKey, secretKey, options) {
        super(accessKey, secretKey, options);
    }
}

module.exports = ONSConsumer;
