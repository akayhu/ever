"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfileAppraiseController from "src/server/controllers/ProfileAppraiseController";

export default {
	"/ajax/profile/appraise": {
		"/queryAppraiseList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileAppraiseController.actionQueryAppraiseList
			]
		},
		"/queryAppraiseListOfOwner": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileAppraiseController.actionQueryAppraiseListOfOwner
			]
		},
		"/addAppraiseText": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileAppraiseController.actionAddAppraiseText
			]
		},
		"/queryAppraisePendingList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileAppraiseController.actionQueryAppraisePendingList
			]
		},
		"/deleteAppraiseText": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileAppraiseController.actionDeleteAppraiseText
			]
		},
		"/publishAppraiseText": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileAppraiseController.actionPublishAppraiseText
			]
		}
	}
};
