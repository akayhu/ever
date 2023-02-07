"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as NotificationController from "src/server/controllers/NotificationController";

export default {
	"/ajax/notification": {
		"/getMixListByAction": {
			method: 'get',
			handler: [
				BaseController.prelog,
				NotificationController.actionGetMixListByAction
			]
		},
		"/getBubbleCountByAction": {
			method: 'get',
			handler: [
				BaseController.prelog,
				NotificationController.actionGetBubbleCountByAction
			]
		},
		"/getBubbleCount": {
			method: 'get',
			handler: [
				BaseController.prelog,
				NotificationController.actionGetBubbleCount
			]
		},
		"/setBubbleTimeByType": {
			method: 'all',
			handler: [
				BaseController.prelog,
				NotificationController.actionSetBubbleTimeByType
			]
		},
		"/updateAllStatusById": {
			method: 'post',
			handler: [
				BaseController.prelog,
				NotificationController.actionUpdateAllStatusById
			]
		},
		"/updateMixListAllReadByType": {
			method: 'post',
			handler: [
				BaseController.prelog,
				NotificationController.actionUpdateMixListAllReadByType
			]
		},
		"/send2User": {
			method: 'post',
			handler: [
				BaseController.prelog,
				NotificationController.actionSend2User
			]
		},
		"/getNotifictionByPid": {
			method: 'get',
			handler: [
				BaseController.prelog,
				NotificationController.actionGetNotifictionByPid
			]
		}
	}
};