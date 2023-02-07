"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as TestController from "src/server/controllers/TestController";

export default {
	"/ajax/test": {
		"/checkPjAPI": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TestController.actionCheckPjAPI
			]
		},
		"/answerPjAPI": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TestController.actionAnswerPjAPI
			]
		},
		"/reportBrandPjAPI": {
			method: 'post',
			handler: [
				BaseController.prelog,
				TestController.actionReportBrandPjAPI
			]
		},
		"/checkPoAPI": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TestController.actionCheckPoAPI
			]
		},
		"/answerPoAPI": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TestController.actionAnswerPoAPI
			]
		},
		"/reportBrandPoAPI": {
			method: 'post',
			handler: [
				BaseController.prelog,
				TestController.actionReportBrandPoAPI
			]
		},
		"/checkPiAPI": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TestController.actionCheckPiAPI
			]
		},
		"/answerPiAPI": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TestController.actionAnswerPiAPI
			]
		},
		"/reportBrandPiAPI": {
			method: 'post',
			handler: [
				BaseController.prelog,
				TestController.actionReportBrandPiAPI
			]
		}
	}
};