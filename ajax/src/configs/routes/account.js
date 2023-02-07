"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as AccountController from "src/server/controllers/AccountController";

export default {
	"/ajax/account": {
		"/initial": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountController.actionInitial,
				AccountController.actionUpInsertLoginInfo,
			]
		},
		"/name": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountController.actionName
			]
		},
		"/getEmailInfoByPid": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountController.actionGetEmailInfoByPid
			]
		},
		"/getAccountStatus": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountController.actionGetAccountStatus
			]
		},
		"/getMembershipInfo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountController.actionGetMembershipInfo
			]
		},
	}
};
