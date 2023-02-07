"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as AdvertisingController from "src/server/controllers/AdvertisingController";

export default {
	"/ajax/activityNews": {
    "/getAllAdvertising": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AdvertisingController.actionGetAllAdvertising
			]
    },
    "/outOfAdvertising": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AdvertisingController.actionOutOfAdvertising
			]
		}
  }
};