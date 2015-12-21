/**
 * XadillaX created at 2015-12-21 19:00:56 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var Enum = require("enum");

module.exports = new Enum({
    // 成功
    SUCCESS_VALUE: 0,
    // 未捕获异常
    SYSTEM_ERR_VALUE: 1,
    // 系统繁忙
    SYSTEM_BUSY_VALUE: 2,
    // 请求代码不支持
    REQUEST_CODE_NOT_SUPPORTED_VALUE: 3
});
