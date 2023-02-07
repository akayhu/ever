"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as PersonalConfigController from "src/server/controllers/PersonalConfigController";

export default {
	"/ajax/personal/config": {
		"/syncPersonalConfig":{
			method: 'get',
			handler: [
				BaseController.prelog,
				PersonalConfigController.actionSyncPersonalConfig
			]
		},
		"/queryPersonalConfigByPid":{
			method: 'get',
			handler: [
				BaseController.prelog,
				PersonalConfigController.actionQueryPersonalConfigByPid
			]
		},
		"/queryPersonalConfigByPidAndType":{
			method: 'get',
			handler: [
				BaseController.prelog,
				PersonalConfigController.actionQueryPersonalConfigByPidAndType
			]
		},
		"/updatePersonalConfig":{
			method: 'post',
			handler: [
				BaseController.prelog,
				PersonalConfigController.actionUpdatePersonalConfig
			]
		}
	}
};