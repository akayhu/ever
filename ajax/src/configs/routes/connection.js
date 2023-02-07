"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ConnectionController from "src/server/controllers/ConnectionController";

export default {
	"/ajax/connection": {
		"/getConnectionStatus": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetConnectionStatus
			]
		},
		"/getFriendList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetFriendList
			]
		},
		"/getAllFriendList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetAllFriendList
			]
		},
		"/getInviteList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetInviteList
			]
		},
		"/getFollowList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetFollowList
			]
		},
		"/getMutualFriendList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetMutualFriendList
			]
		},
		"/getMayKnowPeopleList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetMayKnowPeopleList
			]
		},
		"/getExcellentPeopleList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetExcellentPeopleList
			]
		},
		"/getRejectList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetRejectList
			]
		},
		"/getNamecardConnectionInfo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetNamecardConnectionInfo
			]
		},
		"/searchFriend": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionSearchFriend
			]
		},
		"/getGroupItemList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetGroupItemList
			]
		},
		"/getGroupMemberList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetGroupMemberList
			]
		},
		"/invite": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionInvite
			]
		},
		"/accept": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionAccept
			]
		},
		"/reject": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionReject
			]
		},
		"/revoke": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionRevoke
			]
		},
		"/disconnect": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ConnectionController.actionDisconnect
			]
		},
		"/subscribe": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionSubscribe
			]
		},
		"/unsubscribe": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionUnsubscribe
			]
		},
		"/exclude": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionExclude
			]
		},
		"/getExcludeList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetExcludeList
			]
		},
		"/notice": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionNotice
			]
		},
		"/block": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionBlock
			]
		},
		"/getBlockList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ConnectionController.actionGetBlockList
			]
		},
		"/join": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionJoin
			]
		},
		"/createGroup": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionCreateGroup
			]
		},
		"/updateGroupName": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionUpdateGroupName
			]
		},
		"/deleteGroup": {
			method: 'all',
			handler: [
				BaseController.prelog,
				ConnectionController.actionDeleteGroup
			]
		}
	}
};