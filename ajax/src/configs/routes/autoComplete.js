"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as AutoCompleteController from "src/server/controllers/AutoCompleteController";

export default {
	"/ajax/autoComplete": {
		"/getDescript": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AutoCompleteController.actionGetDescript
			]
		},
		"/companyName/:keyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AutoCompleteController.actionGetACCompany
			]
		},
		"/schoolName/:keyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AutoCompleteController.actionGetACSchool
			]
		},
		"/major/:keyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AutoCompleteController.actionGetACMajor
			]
		},
		"/ability/:keyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AutoCompleteController.actionGetACAbility
			]
		},
		"/jobTitle/:keyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AutoCompleteController.actionGetACJobtitle
			]
		},
		"/area/:keyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				AutoCompleteController.actionGetACArea
			]
		}
	}
};