"use strict";
import cPlatform from 'c_platform';

const config = cPlatform.configs.dev;

export default {
	"name"  : "plus_rest",
	"port" : 3002,
	"env" : "dev",
	"params": {
		...config
	}
};
