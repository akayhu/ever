"use strict";
import cPlatform from 'c_platform';
const config = cPlatform.configs.production;
export default {
	"name"  : "plus_rest",
	"port" : 8080,
	"env" : "production",
	"params": {
		...config
	}
};
