"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as IntegrationController from "src/server/controllers/IntegrationController";

export default {
	"/ajax/time" : {
		method: 'all',
		handler: [
			BaseController.prelog,
			IntegrationController.actionGetServerTime
		]
	},
	"/ajax/integration/getMyWish" : {
		method: 'all',
		handler: [
			BaseController.prelog,
			IntegrationController.actionGetMyWish
		]
	},
	"/ajax/company" : {
		method: 'all',
		handler: [
			BaseController.prelog,
			IntegrationController.actionCompany
		]
	},
	"/ajax/jobwiki/getFuture": {
		method: 'get',
		handler: [
			BaseController.prelog,
			IntegrationController.actionGetFuture
		]
	}
};