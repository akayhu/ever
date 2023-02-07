"use strict";

import path from "path";
import clientConfig from './client';

const config = {
	"name"  : "c_platform",
	"port" : 3000,
	"env" : "dev",
	"basePath" : path.resolve(__dirname, '../../'),
	...clientConfig
};

export default config;