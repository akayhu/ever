"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as BcCommunicationController from "src/server/controllers/BcCommunicationController";

export default {
	"/ajax/bcCommunication": {
		"/getMsgList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionGetMsgList
			]
		},
		"/getMsgDetail": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionGetMsgDetail
			]
		},
		"/getUnreadMsgCnt": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionGetUnreadMsgCnt
			]
		},
		"/sendMsg": {
			method: 'all',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionSendMsg
			]
		},
		"/getContactInfo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionGetContactInfo
			]
		},
		"/setContactInfo": {
			method: 'post',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionSetContactInfo
			]
		},
		"/queryPidStatus": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionQueryPidStatus
			]
		},
		"/baseConvert": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionBaseConvert
			]
		},
		"/getAttachFile": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionGetAttachFile
			]
		},
		"/uploadNewBCAttach": {
			method: 'all',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionUploadNewBCAttach
			]
		},
		"/getCompanyLogo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				BcCommunicationController.actionGetCompanyLogo
			]
		}
	}
};
