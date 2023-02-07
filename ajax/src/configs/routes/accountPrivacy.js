"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as AccountPrivacyController from "src/server/controllers/AccountPrivacyController";

export default {
	"/ajax/account/privacy": {
		"/setMemberIdentity": {
			method: 'post',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionSetMemberIdentity
			]
		},
		"/getMemberIdentityList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionGetMemberIdentityList
			]
		},
		"/isAllowReadProfile": {
			method: 'post',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionIsAllowReadProfile
			]
		},
		"/queryPrivacyByPids": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionQueryPrivacyByPids
			]
		},
		"/queryPrivacyInfo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionQueryPrivacyInfo
			]
		},
		"/querySinglePrivacy": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionQuerySinglePrivacy
			]
		},
		"/updatePrivacy": {
			method: 'post',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionUpdatePrivacy
			]
		},
		"/updateSinglePrivacy": {
			method: 'post',
			handler: [
				BaseController.prelog,
				AccountPrivacyController.actionUpdateSinglePrivacy
			]
		}
	}
};