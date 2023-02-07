"use strict";

import cPlatform from 'c_platform';

const config = cPlatform.configs.staging;

export default {
	"name"  : "c_wap",
	"port" : 8080,
	"env" : "staging",
	"params" : {
		...config
	}
};
