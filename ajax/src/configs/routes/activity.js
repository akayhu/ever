"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ActivityController from "src/server/controllers/ActivityController";

export default {
	"/ajax/activity": {
		"/addEndorse": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionAddEndorse
			]
		},
		"/addEndorseList": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionAddEndorseList
			]
		},
		"/collect": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionCollect
			]
		},
		"/create": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionCreate
			]
		},
		"/createComment": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionCreateComment
			]
		},
		"/delete": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionDelete
			]
		},
		"/delEndorseItems": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionDelEndorseItems
			]
		},
		"/delEndorser": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionDelEndorser
			]
		},
		"/getActivity": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetActivity
			]
		},
		"/getActivityCountByPids": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetActivityCountByPids
			]
		},
		"/getActivityListByChannel": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetActivityListByChannel
			]
		},
		"/getAllEndorse": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetAllEndorse
			]
		},
		"/getCommentList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetCommentList
			]
		},
		"/getCollectList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetCollectList
			]
		},
		"/getMyCollectCount": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetMyCollectCount
			]
		},
		"/getPersonalWall": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetPersonalWall
			]
		},
		"/getPersonalRiver": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetPersonalRiver
			]
		},
		"/getPersonalRiverHot": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetPersonalRiverHot
			]
		},
		"/getPersonalRiverNew": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetPersonalRiverNew
			]
		},
		"/getPersonalRiverAll": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetPersonalRiverAll
			]
		},
		"/getRelatedActivity": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ActivityController.actionGetRelatedActivity
			]
		},
		"/ignore": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionIgnore
			]
		},
		"/like": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionLike
			]
		},
		"/notInterested": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionNotInterested
			]
		},
		"/removecollect": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionRemovecollect
			]
		},
		"/subscribe": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionSubscribe
			]
		},
		"/suggestEndorse": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionSuggestEndorse
			]
		},
		"/unlike": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionUnlike
			]
		},
		"/update": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionUpdate
			]
		},
		"/undo_notInterested": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionUndoNotInterested
			]
		},
		"/unsubscribe": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ActivityController.actionUnsubscribe
			]
		},
		"/viewActivity": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ActivityController.actionViewActivity
			]
		}
	}
};