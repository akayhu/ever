"use strict";

import {actionCode} from "../server/controllers/ErrorController";
import {actionIndex, actionWelcome, actionBackToPc, actionAjax, actionProfileSub, actionInit} from "../server/controllers/IndexController";
import {actionGroup, actionMediaKeyword, actionProfile} from "../server/controllers/RoutesController";

const routes = {
	"/m/activity/:aid": {
		method: "get",
		layout: "ActivityLayout"
	},
	'/m/profile/:pid/activity': {
		method: "all",
		handler: actionProfileSub
	},
  '/m/profile/:pid/connection': {
  	method: "all",
		handler: actionProfileSub
  },
	"/m/profile/:pid": {
		method: "get",
		layout: "ProfileLayout"
	},
	"/m/error": {
		"/:error_code/:error_status": {
			method: "all",
			handler: actionCode,
			layout: "ErrorLayout"
		},
		"/:error_code": {
			method: "all",
			handler: actionCode,
			layout: "ErrorLayout"
		}
	},
	"/m/notification": {
		method: "get",
		login: true
	},
	"/m/myCollect": {
		method: "get",
		login: true
	},
	"/m/myGroup": {
		method: "get",
		login: true,
		layout: "GroupLayout"
	},
	"/m/topic/:keyword": {
		method: "get",
		login: true
	},
	'/m/104beagiver/:current': {
		method: 'get',
		layout: 'BeAGiverLayout'
	},
	"/m/104beagiver": {
		method: 'get',
		layout: 'BeAGiverLayout'
	},
	"/m/backToPc": {
		method: "all",
		handler: actionBackToPc
	},
	"/m/welcome": {
		method: 'get',
		handler: actionWelcome,
	},
	"/m/group/:gid?": {
		method: "all",
		layout: "GroupLayout"
	},
	"/m/p/group/:gid": {
		method: "all",
		handler: actionGroup,
	},
	"/m/media/:cid": {
		method: "all",
		handler: actionMediaKeyword,
	},
	"/m/channel/:cid": {
		method: "get",
		layout: "ChannelLayout"
	},
	'/m/initial': {
		method: "all",
		handler: actionInit
	},
	"/m/:keyword": {
		method: 'all',
		handler: actionProfile
	}
};

if(process.env.NODE_ENV === 'dev'){
	if(global.isomorphic === true){
		routes["/ajax"] = {
			"/*" : {
				method: 'all',
				handler: actionAjax
			}
		}
	}
}

routes["/m"] = {
	method: "all",
	handler: actionIndex,
	layout: "IndexLayout"
};

export default routes;
