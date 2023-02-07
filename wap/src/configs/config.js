"use strict";

import path from 'path';
import clientConfig from './client';
import customTypeListConfig from './customTypeList';

const config = {
	name: 'c_wap',
	port: 3000,
	env: 'dev',
	basePath: path.resolve(__dirname, '../../'),
	params: {
		apnum: 10400
	},
	...clientConfig,
	...customTypeListConfig
};

export default config;
