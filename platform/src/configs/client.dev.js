"use strict";
import { dev } from './generalConfig';
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
const staticPlatformUrl = canUseDOM ? '//'+location.host : '//pluslocal.104-dev.com.tw:3000';

export default {
	"name"  : "c_platform",
	"port" : 3000,
	"env" : "dev",
	"params" : {
		...dev,
		staticPlatformUrl: staticPlatformUrl
	}
};
