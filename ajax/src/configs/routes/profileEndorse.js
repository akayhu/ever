"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfileEndorseController from "src/server/controllers/ProfileEndorseController";

export default {
	"/ajax/profile/profileEndorse": {
		"/updateEndorseSort": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionUpdateEndorseSort
			]
		},
		"/updateEndorseDesc": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionUpdateEndorseDesc
			]
		},
		"/getEndorseTopList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionGetEndorseTopList
			]
		},
		"/getEndorseList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionGetEndorseList
			]
		},
		"/getEndorseSortList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionGetEndorseSortList
			]
		},
		"/getEndorseListExcludeTop": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionGetEndorseListExcludeTop
			]
		},
		"/deleteEndorse": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionDeleteEndorse
			]
		},
		"/addEndorseForUser": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionAddEndorseForUser
			]
		},
		"/createEndorse": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionCreateEndorse
			]
		},
		"/getEndorseUserList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionGetEndorseUserList
			]
		},
		"/removeEndorseForUser": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileEndorseController.actionRemoveEndorseForUser
			]
		}
	}
};