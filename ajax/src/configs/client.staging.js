"use strict";
import cPlatform from 'c_platform';
const config = cPlatform.configs.staging;
export default {
	"name"  : "plus_rest",
	"port" : 8080,
	"env" : "staging",
	"params": {
		...config
	}
};
