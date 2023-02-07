"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ProfileChronologyController from "src/server/controllers/ProfileChronologyController";

export default {
	"/ajax/profile/profileChronology": {
		"/getEduExpMixedList":{
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionGetEduExpMixedList
			]
		},
		"/getExpEventList":{
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionGetChronicleExp
			]
		},
		"/getEduEventList":{
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionGetChronicleEdu
			]
		},
		"/getHonorEventList":{
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionGetChronicleHonor
			]
		},
		"/getAllEventList":{
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionGetChronicleAll
			]
		},
		"/getFullEventForAnalysis":{
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionGetFullEventForAnalysis
			]
		},
		"/getRecentEventList":{
			method: 'get',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionGetRecentEventList
			]
		},
		"/createExpEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionCreateExpEvent
			]
		},
		"/createEduEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionCreateEduEvent
			]
		},
		"/createHonorEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionCreateHonorEvent
			]
		},
		"/deleteExpEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionDeleteExpEvent
			]
		},
		"/deleteEduEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionDeleteEduEvent
			]
		},
		"/deleteHonorEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionDeleteHonorEvent
			]
		},
		"/deleteEventByPid":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionDeleteEventByPid
			]
		},
		"/updateExpEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionUpdateExpEvent
			]
		},
		"/updateEduEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionUpdateEduEvent
			]
		},
		"/updateHonorEvent":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionUpdateHonorEvent
			]
		},
		"/updateEventPrivacySetting":{
			method: 'post',
			handler: [
				BaseController.prelog,
				ProfileChronologyController.actionUpdateEventPrivacySetting
			]
		}
	}
};