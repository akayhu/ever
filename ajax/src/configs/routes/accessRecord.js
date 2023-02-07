"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as AccessRecordController from "src/server/controllers/AccessRecordController";

export default {
	"/ajax/profile/accessRecord": {
		"/viewActivity": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionViewActivity
			]
		},
		"/queryActivityTotalPvByAuthor": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionQueryActivityTotalPvByAuthor
			]
		},
		"/queryViewerFromPro": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionQueryViewerFromPro
			]
		},
		"/queryViewer": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionQueryViewer
			]
		},
		"/queryViewerCount": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionQueryViewerCount
			]
		},
		"/viewProfile": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionViewProfile
			]
		},
		"/queryActivityTotalPv": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionQueryActivityTotalPv
			]
		},
		"/viewProfileFromPro": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionViewProfileFromPro
			]
		},
		"/queryViewCountFromPro": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccessRecordController.actionQueryViewCountFromPro
			]
		}
	}
};
