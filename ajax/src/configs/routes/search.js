"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as SearchController from "src/server/controllers/SearchController";

export default {
	"/ajax/search": {
		"/searchPerson": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchPerson
			]
		},
		"/searchByTag": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchByTag
			]
		},
		"/searchByKeyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchByKeyword
			]
		},
		"/searchByKeywordAtPublicChannel": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchByKeywordAtPublicChannel
			]
		},
		"/searchByKeywordAtPrivateChannel": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchByKeywordAtPrivateChannel
			]
		},
		"/searchByKeywordAtAuthor": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchByKeywordAtAuthor
			]
		},
		"/searchMediaByKeyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchMediaByKeyword
			]
		},
		"/searchGroupByKeyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionSearchGroupByKeyword
			]
		},
		"/activityKeywordSuggest/:keyword": {
			method: 'get',
			handler: [
				BaseController.prelog,
				SearchController.actionActivityKeywordSuggest
			]
		}
	}
};