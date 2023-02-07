"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfileController from "src/server/controllers/ProfileController";

export default {
	"/ajax/user" : {
		"/:pid": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileController.actionLoginUser
			]
		},
		"/": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileController.actionLoginUser
			]
		}
	},
	"/ajax/profile": {
		"/:pid/wrap": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileController.actionGetWrapProfileInfo
			]
		},
		"/:pid": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileController.actionDetail
			]
		},
		"/updateAvatarImage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileController.actionUpdateAvatar
			]
		},
		"/adjustAvatarImage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileController.actionAdjustAvatar
			]
		},
		"/deleteAvatarImage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileController.actionDeleteAvatar
			]
		},
		"/updateCoverImage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileController.actionUpdateCover
			]
		},
		"/adjustCoverImage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileController.actionAdjustCover
			]
		},
		"/deleteCoverImage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileController.actionDeleteCover
			]
		}
	}
};
