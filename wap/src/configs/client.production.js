"use strict";

import cPlatform from 'c_platform';

const config = cPlatform.configs.production;

export default {
	"name"  : "c_wap",
	"port" : 8080,
	"env" : "production",
	"params" : {
		...config
	}
};
