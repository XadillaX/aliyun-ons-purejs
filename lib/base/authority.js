/**
 * XadillaX created at 2016-09-12 11:16:27 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const Enum = require("enum");
const EnumItem = require("enum/dist/enumItem");

const CHANNEL = new Enum({
    ALIYUN: 1,
    CLOUD: 2,
    ALL: 1000
}, {
    ignoreCase: true,
    freez: true
});

class ONSAuthority {
    constructor(accessKey, secretKey, channel) {
        Object.defineProperties(this, {
            accessKey: {
                enumerable: true,
                writable: true,
                configurable: false,
                value: accessKey
            },
            secretKey: {
                enumerable: false,
                writable: true,
                configurable: false,
                value: secretKey
            },
            channel: {
                enumerable: true,
                writable: true,
                configurable: false,
                value: CHANNEL.ALIYUN
            }
        });

        /**
         * 1. channel is a number (1, 2, ..., 100, ...) ↓
         * 2. channel is a string ("ALIYUN", "CLOUD", ...), we get the enum item from `CHANNEL`
         *
         * 3. channel is an `EnumItem`, we assign it directly
         */
        if(channel !== undefined) {
            if(typeof channel === "number" || typeof channel === "string") {
                const _channel = CHANNEL.get(channel);
                if(undefined !== _channel) {
                    this.channel = _channel;
                }
            } else if(EnumItem.isEnumItem(channel)) {
                this.channel = channel;
            }
        }
    }
}

ONSAuthority.CHANNEL = CHANNEL;

module.exports = ONSAuthority;
