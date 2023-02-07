"use strict";

import cPlatform from 'c_platform';

const config = cPlatform.configs.dev;

export default {
	"name"  : "plus_mweb_wap",
	"port" : 3000,
	"env" : "dev",
	"params" : {
		...config
	}
};
