"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfileNameCardController from "src/server/controllers/ProfileNameCardController";

export default {
	"/ajax/profile/profileNameCard": {
		"/getNameCard": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileNameCardController.actionGetNameCard
			]
		},
		"/getNameCardList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileNameCardController.actionGetNameCardList
			]
		}
	}
};