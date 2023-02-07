"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as PuhserContorller from "src/server/controllers/PusherController";
export default {
	"/ajax/pusher": {
		"/auth": {
			method: 'post',
			handler: [
				BaseController.prelog,
				PuhserContorller.actionAuth
			]
		},
		"/getNotiByPid": {
			method: 'get',
			handler: [
				BaseController.prelog,
				PuhserContorller.actionGetNotiByPid
			]
		},
		"/getUnreadNotify": {
			method: 'get',
			handler: [
				BaseController.prelog,
				PuhserContorller.actionGetUnreadNotify
			]
		}
	}
};