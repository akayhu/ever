"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as AccuseController from "src/server/controllers/AccuseController";

export default {
	"/ajax/accuse": {
		"/getAccuseItem": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AccuseController.actionGetAccuseItem
			]
		},
		"/accuseTerribleActivity": {
			method: 'all',
			handler: [
				BaseController.prelog,
				AccuseController.actionAccuseTerribleActivity
			]
		},
		"/accuseTerriblePerson": {
			method: 'all',
			handler: [
				BaseController.prelog,
				AccuseController.actionAccuseTerriblePerson
			]
		}
	}
};
