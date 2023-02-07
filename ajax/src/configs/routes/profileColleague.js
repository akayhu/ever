"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfileColleagueController from "src/server/controllers/ProfileColleagueController";

export default {
	"/ajax/profile/colleague": {
		"/queryColleagueList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileColleagueController.actionQueryColleagueList
			]
		},
		"/colleagueWishStatus": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileColleagueController.actionColleagueWishStatus
			]
		},
		"/addColleague": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileColleagueController.actionAddColleague
			]
		},
		"/removeColleague": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileColleagueController.actionRemoveColleague
			]
		}
	}
};
