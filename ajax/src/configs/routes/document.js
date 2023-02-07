"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as DocumentController from "src/server/controllers/DocumentController";

export default {
	"/ajax/doc/encrypt-param" : {
		method: 'get',
		handler: [
			BaseController.prelog,
			DocumentController.actionGetEncryParam
		]
	},
	"/ajax/getSignature": {
		"/profileAvatar": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureProfileAvatar
			]
		},
		"/profileCover": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureProfileCover
			]
		},
		"/groupAvatar": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureGroupAvatar
			]
		},
		"/groupCover": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureGroupCover
			]
		},
		"/activityImage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureImage
			]
		},
		"/activityDocument": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureDocument
			]
		},
		"/activityVideo": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureVideo
			]
		},
		"/activityAudio": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionGetSignatureAudio
			]
		}
	},
	"/ajax/reConvert": {
		"/profileAvatar": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionReConvertProfileAvatar
			]
		},
		"/profileCover": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionReConvertProfileCover
			]
		},
		"/groupAvatar": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionReConvertGroupAvatar
			]
		},
		"/groupCover": {
			method: 'post',
			handler: [
				BaseController.prelog,
				DocumentController.actionReConvertGroupCover
			]
		},
	},
	"/ajax/getFileDetail" : {
		method: 'get',
		handler: [
			BaseController.prelog,
			DocumentController.actionGetFileDetail
		]
	},
	"/ajax/htmlConvert" : {
		method: 'post',
		handler: [
			BaseController.prelog,
			DocumentController.actionHtmlConvert
		]
	},
	"/ajax/getFileUrl" : {
		method: 'all',
		handler: [
			BaseController.prelog,
			DocumentController.actionGetFileUrl
		]
	},
	// "/ajax/discardFile" : {
	// 	method: 'post',
	// 	handler: [
	// 		BaseController.prelog,
	// 		DocumentController.actionDiscardFile
	// 	]
	// }
};
