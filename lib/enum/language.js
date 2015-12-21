/**
 * XadillaX created at 2015-12-21 18:59:47 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var Enum = require("enum");

module.exports = new Enum({
    JAVA: 0,
    CPP: 1,
    DOTNET: 2,
    PYTHON: 3,
    DELPHI: 4,
    ERLANG: 5,
    RUBY: 6,
    OTHER: 7
}, {
    ignoreCase: true
});
