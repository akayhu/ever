"use strict";

import path from "path";
import clientConfig from './client';

let config = {
	"name"  : "plus_rest",
	"port" : 3002,
	"env" : "dev",
	"basePath"  : path.resolve(__dirname, '../../'),
	"params" : {
		"apnum" : 10400,
		"tokenCid" : "b5ae2975b5fdfc7f4c3084daaa3b57c1"
	},
	...clientConfig
};

export default config;
