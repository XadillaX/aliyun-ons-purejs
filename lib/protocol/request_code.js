/**
 * XadillaX created at 2015-12-21 14:16:03 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var Enum = require("enum");

module.exports = new Enum({
    // Broker 发送消息
	SEND_MESSAGE_VALUE: 10,
	// Broker 订阅消息
	PULL_MESSAGE_VALUE: 11,
	// Broker 查询消息
	QUERY_MESSAGE_VALUE: 12,
	// Broker 查询Broker Offset
	QUERY_BROKER_OFFSET_VALUE: 13,
	// Broker 查询Consumer Offset
	QUERY_CONSUMER_OFFSET_VALUE: 14,
	// Broker 更新Consumer Offset
	UPDATE_CONSUMER_OFFSET_VALUE: 15,
	// Broker 更新或者增加一个Topic
	UPDATE_AND_CREATE_TOPIC_VALUE: 17,
	// Broker 获取所有Topic的配置（Slave和Namesrv都会向Master请求此配置）
	GET_ALL_TOPIC_CONFIG_VALUE: 21,
	// Broker 获取所有Topic配置（Slave和Namesrv都会向Master请求此配置）
	GET_TOPIC_CONFIG_LIST_VALUE: 22,
	// Broker 获取所有Topic名称列表
	GET_TOPIC_NAME_LIST_VALUE: 23,
	// Broker 更新Broker上的配置
	UPDATE_BROKER_CONFIG_VALUE: 25,
	// Broker 获取Broker上的配置
	GET_BROKER_CONFIG_VALUE: 26,
	// Broker 触发Broker删除文件
	TRIGGER_DELETE_FILES_VALUE: 27,
	// Broker 获取Broker运行时信息
	GET_BROKER_RUNTIME_INFO_VALUE: 28,
	// Broker 根据时间查询队列的Offset
	SEARCH_OFFSET_BY_TIMESTAMP_VALUE: 29,
	// Broker 查询队列最大Offset
	GET_MAX_OFFSET_VALUE: 30,
	// Broker 查询队列最小Offset
	GET_MIN_OFFSET_VALUE: 31,
	// Broker 查询队列最早消息对应时间
	GET_EARLIEST_MSG_STORETIME_VALUE: 32,
	// Broker 根据消息ID来查询消息
	VIEW_MESSAGE_BY_ID_VALUE: 33,
	// Broker Client向Client发送心跳，并注册自身
	HEART_BEAT_VALUE: 34,
	// Broker Client注销
	UNREGISTER_CLIENT_VALUE: 35,
	// Broker Consumer将处理不了的消息发回服务器
	CONSUMER_SEND_MSG_BACK_VALUE: 36,
	// Broker Commit或者Rollback事务
	END_TRANSACTION_VALUE: 37,
	// Broker 获取ConsumerId列表通过GroupName
	GET_CONSUMER_LIST_BY_GROUP_VALUE: 38,
	// Broker 主动向Producer回查事务状态
	CHECK_TRANSACTION_STATE_VALUE: 39,
	// Broker Broker通知Consumer列表变化
	NOTIFY_CONSUMER_IDS_CHANGED_VALUE: 40,
	// Broker Consumer向Master锁定队列
	LOCK_BATCH_MQ_VALUE: 41,
	// Broker Consumer向Master解锁队列
	UNLOCK_BATCH_MQ_VALUE: 42,
	// Broker 获取所有Consumer Offset
	GET_ALL_CONSUMER_OFFSET_VALUE: 43,
	// Broker 获取所有定时进度
	GET_ALL_DELAY_OFFSET_VALUE: 45,
	// Namesrv 向Namesrv追加KV配置
	PUT_KV_CONFIG_VALUE: 100,
	// Namesrv 从Namesrv获取KV配置
	GET_KV_CONFIG_VALUE: 101,
	// Namesrv 从Namesrv获取KV配置
	DELETE_KV_CONFIG_VALUE: 102,
	// Namesrv 注册一个Broker，数据都是持久化的，如果存在则覆盖配置
	REGISTER_BROKER_VALUE: 103,
	// Namesrv 卸载一个Broker，数据都是持久化的
	UNREGISTER_BROKER_VALUE: 104,
	// Namesrv 根据Topic获取Broker Name、队列数(包含读队列与写队列)
	GET_ROUTEINTO_BY_TOPIC_VALUE: 105,
	// Namesrv 获取注册到Name Server的所有Broker集群信息
	GET_BROKER_CLUSTER_INFO_VALUE: 106,
	UPDATE_AND_CREATE_SUBSCRIPTIONGROUP_VALUE: 200,
	GET_ALL_SUBSCRIPTIONGROUP_CONFIG_VALUE: 201,
	GET_TOPIC_STATS_INFO_VALUE: 202,
	GET_CONSUMER_CONNECTION_LIST_VALUE: 203,
	GET_PRODUCER_CONNECTION_LIST_VALUE: 204,
	WIPE_WRITE_PERM_OF_BROKER_VALUE: 205,

	// 从Name Server获取完整Topic列表
	GET_ALL_TOPIC_LIST_FROM_NAMESERVER_VALUE: 206,
	// 从Broker删除订阅组
	DELETE_SUBSCRIPTIONGROUP_VALUE: 207,
	// 从Broker获取消费状态（进度）
	GET_CONSUME_STATS_VALUE: 208,
	// Suspend Consumer消费过程
	SUSPEND_CONSUMER_VALUE: 209,
	// Resume Consumer消费过程
	RESUME_CONSUMER_VALUE: 210,
	// 重置Consumer Offset
	RESET_CONSUMER_OFFSET_IN_CONSUMER_VALUE: 211,
	// 重置Consumer Offset
	RESET_CONSUMER_OFFSET_IN_BROKER_VALUE: 212,
	// 调整Consumer线程池数量
	ADJUST_CONSUMER_THREAD_POOL_VALUE: 213,
	// 查询消息被哪些消费组消费
	WHO_CONSUME_THE_MESSAGE_VALUE: 214,

	// 从Broker删除Topic配置
	DELETE_TOPIC_IN_BROKER_VALUE: 215,
	// 从Namesrv删除Topic配置
	DELETE_TOPIC_IN_NAMESRV_VALUE: 216,
	// Namesrv 通过 project 获取所有的 server ip 信息
	GET_KV_CONFIG_BY_VALUE_VALUE: 217,
	// Namesrv 删除指定 project group 下的所有 server ip 信息
	DELETE_KV_CONFIG_BY_VALUE_VALUE: 218,
	// 通过NameSpace获取所有的KV List
	GET_KVLIST_BY_NAMESPACE_VALUE: 219,
}, {
    ignoreCase: true
});
