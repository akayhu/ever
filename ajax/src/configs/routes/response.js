"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ResponseController from "src/server/controllers/ResponseController";

export default {
	"/ajax/testError": {
        method: 'all',
        handler: [
            BaseController.prelog,
            ResponseController.testError
        ]
	},
    "/ajax/testWarning": {
        method: 'all',
        handler: [
            BaseController.prelog,
            ResponseController.testWarning
        ]
	}
};