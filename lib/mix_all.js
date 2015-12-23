/**
 * XadillaX created at 2015-12-22 10:57:55 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

module.exports = {
    MASTER_ID: 0,
    DEFAULT_TOPIC: "TBW102",
    BENCHMARK_TOPIC: "BenchmarkTest",
    DEFAULT_PRODUCER_GROUP: "DEFAULT_PRODUCER",
    DEFAULT_CONSUMER_GROUP: "DEFAULT_CONSUMER",
    TOOLS_CONSUMER_GROUP: "TOOLS_CONSUMER",
    CLIENT_INNER_PRODUCER_GROUP: "CLIENT_INNER_PRODUCER",
    SELF_TEST_TOPIC: "SELF_TEST_TOPIC",
    RETRY_GROUP_TOPIC_PREFIX: "%RETRY%",
    DLQ_GROUP_TOPIC_PTEFIX: "%DLQ%",
    NAMESRV_ADDR_ENV: "NAMESRV_ADDR",
    ROCKETMQ_HOME_ENV: "ROCKETMQ_HOME",
    ROCKETMQ_HOME_PROPERTY: "rocketmq.home.dir",
    MESSAGE_COMPRESS_LEVEL: "rocketmq.message.compressLevel",
    WSADDR_INTERNET: "http://onsaddr-internet.aliyun.com/rocketmq/nsaddr4client-internet",

    getRetryTopic: function(consumerGroup) {
        return this.RETRY_GROUP_TOPIC_PREFIX + consumerGroup;
    }
};
