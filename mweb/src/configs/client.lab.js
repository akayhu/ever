"use strict";


import cPlatform from 'c_platform';

const config = cPlatform.configs.lab;

export default {
	"name"  : "plus_mweb_wap",
	"port" : 8080,
	"env" : "lab",
	"params" : {
		...config
	}
};
