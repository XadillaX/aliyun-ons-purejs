/**
 * XadillaX created at 2016-09-13 14:09:35 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const CppUtil = require("../../../build/Release/cpp_util");

class RocketBaseClient {
    constructor() {
        this.clientIP = CppUtil.getLocalAddress();
        this.instanceName = "DEFAULT";
    }
}

module.exports = RocketBaseClient;
