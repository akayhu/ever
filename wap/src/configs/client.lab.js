"use strict";

import cPlatform from 'c_platform';
// var cPlatform = require('c_platform');
var config = cPlatform.configs.lab;

export default {
	"name"  : "c_wap",
	"port" : 8080,
	"env" : "lab",
	"params" : {
		...config
	}
};
