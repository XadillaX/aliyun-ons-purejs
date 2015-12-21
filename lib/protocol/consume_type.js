/**
 * XadillaX created at 2015-12-21 17:07:18 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var Enum = require("enum");

exports.ConsumeType = new Enum({
    // 主动
    CONSUME_ACTIVELY: 0,

    // 被动
    CONSUME_PASSIVELY: 1
}, {
    ignoreCase: true
});

exports.ConsumeFromWhere = new Enum({
    // 上次记录消费点
    CONSUME_FROM_LAST_OFFSET: 0,

    // 上次记录消费点，如果是第一次启动则最小消费点
    CONSUME_FROM_LAST_OFFSET_AND_FROM_MIN_WHEN_BOOT_FIRST: 1,

    // 最小消费点（建议测试使用）
    CONSUME_FROM_MIN_OFFSET: 2,

    // 最大消费点（建议测试使用）
    CONSUME_FROM_MAX_OFFSET: 3
}, {
    ignoreCase: true
});

exports.MessageModel = new Enum({
    // 广播
    BROADCASTING: 0,

    // 集群
    CLUSTERING: 1
});
