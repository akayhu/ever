"use strict";

import path from "path";
import clientConfig from './client';

let config = {
	"name"  : "plus_mweb_wap",
	"port" : 3000,
	"env" : "dev",
	"basePath"  : path.resolve(__dirname, '../../'),
	"params" : {
		"apnum" : 10400
	},
	...clientConfig
};

export default config;

/*
"use strict";

import path from "path";
import deepAssign from "deep-assign";
import clientConfig from './client';

let config = deepAssign({
	"name"  : "plus_mweb_wap",
	"port" : 3000,
	"env" : "dev",
	"basePath"  : path.resolve(__dirname, '../../'),
	"urlPrefixPath": "/m",
	"staticFolder" : "public",
	"i18nFolder" : "src/client/locales",
	"routerFolder": "src/client",
	"language" : "zhTW",
	"device" : "mobile",
	"charset" : "UTF-8",
	"defaultErrorController" : "error/code",
	"webpackDevConfig" : "src/configs/bundle.dev.js",
	"middlewares" : {
		"CsMock" : {
			"path": "src/server/middlewares/CsMockMiddleware",
			"exec": true
		},
		"Device" : {
			"path": "src/server/middlewares/DeviceMiddleware",
			"exec": true
		},
		"RemoteFetch" : {
			"path": "c_platform.middlewares.RemoteFetchMiddleware",
			"exec": true
		}
	},
	"components"  : {
		"urlManager"  : {
			"rules" : {
				"/m": {
					"/": ["index/view", true],
					"/renew/:mode/:time" : "index/renew",
					"/monitor/sigt": "index/monitor",
					"/profile/:pid(\\d+)": "profile/view",
					"/activity/:aid(.+)": "activity/view",
					"/subscribe": "subscribe/view",
					"/myGroups": "mygroup/view",
					"/myCollect": "collect/view",
					"/group": {
						"/": "group/list",
						"/:gid(\\d+)": "group/view"
					},
					"/search": {
						"/": "search/view",
						"/:mode": "search/mode",
						"/:mode/:keyword(.+):": "search/keyword"
					},
					"/topic": "topic/keyword",
					"/topic/:keyword(.+)": "topic/keyword",
					"/notification": "notification/view",

					"/error" : {
						"/:error_code(\\d+)" : "error/code",
						"/:error_code(\\d+)/:error_status(.+)" : "error/code"
					}
				},
				"/ajax/*" : "index/ajax",
				//"m/welcome": "welcome/view"
			},
			"controllerPath" : [
				"src/server/controllers"
			]
		},
		"log" : {
			"replaceConsole" : true,
			"showConsole" : true,
			"format" : ":method :url",
			"rules" : {
				"error" : {
					"maxLogSize" : 20480,
					"backups" : 10,
					"enabled" : true
				},
				"warning" : {
					"maxLogSize" : 20480,
					"backups" : 10,
					"enabled" : true
				},
				"normal" : {
					"maxLogSize" : 20480,
					"backups" : 10,
					"enabled" : true
				}
			}
		},
		"loginFilter" : {
			"class" : "c_platform.filters.LoginFilter"
		}
	},
	"params" : {
		"apnum" : 10400,
		"apiUrl" : {
			"esb" : 'http://api.104-dev.com.tw/services',
			"mc" : 'http://in.api.104-dev.com.tw/services'
		}
	}
}, clientConfig);

if(config.env !== "dev"){
	config.components.log.filepath = "/opt/node/logs";
	config.components.log.rules.normal.filename = "/opt/node/logs/plus_mweb_wap.access.log";
	config.components.log.rules.warning.filename = "/opt/node/logs/plus_mweb_wap.warning.log";
	config.components.log.rules.error.filename = "/opt/node/logs/plus_mweb_wap.error.log";
	
	delete config.components.urlManager.rules["/ajax/*"];
}

export default config;*/
