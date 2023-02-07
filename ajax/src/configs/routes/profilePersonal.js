"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfilePersonalController from "src/server/controllers/ProfilePersonalController";

export default {
	"/ajax/profile/profilePersonal": {
		"/updateUserIntroduction": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfilePersonalController.actionUpdateUserIntroduction
			]
		},
		"/deleteCover": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfilePersonalController.actionDeleteCover
			]
		},
		"/getUserInfo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfilePersonalController.actionGetUserInfo
			]
		},
		"/initialUser": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ProfilePersonalController.actionInitialUser
			]
		},
		"/updateUserNameDisplay": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfilePersonalController.actionUpdateUserNameDisplay
			]
		},
		"/updateCover": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfilePersonalController.actionUpdateCover
			]
		},
		"/deleteAvatar": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfilePersonalController.actionDeleteAvatar
			]
		}
	}
};