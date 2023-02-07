"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as TopicController from "src/server/controllers/TopicController";

export default {
	"/ajax/topic": {
		"/getSubscribeList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetSubscribeList
			]
		},
		"/subscribe": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionSubscribe
			]
		},
		"/unsubscribe": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionUnsubscribe
			]
		},
		"/getEndorseList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetEndorseList
			]
		},
		"/getMediaList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetMediaList
			]
		},
		"/getHonorList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetHonorList
			]
		},
		"/getGroupList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetGroupList
			]
		},
		"/getGalleryList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetGalleryList
			]
		},
		"/getRelatedFunction": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetRelatedFunction
			]
		},
		"/getEndorsePeopleList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetEndorsePeopleList
			]
		},
		"/getFollowedList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetFollowedList
			]
		},
		"/getWorkspaceListHot": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionGetWorkspaceListHot
			]
		},
		"/initEndorseSection": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionInitEndorseSection
			]
		},
		"/initRelatedSection": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionInitRelatedSection
			]
		},
		"/initHonorSection": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionInitHonorSection
			]
		},
		"/initMediaSection": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionInitMediaSection
			]
		},
		"/initGroupSection": {
			method: 'get',
			handler: [
				BaseController.prelog,
				TopicController.actionInitGroupSection
			]
		}
	}
};
