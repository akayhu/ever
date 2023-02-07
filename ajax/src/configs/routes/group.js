"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as GroupController from "src/server/controllers/GroupController";

export default {
	"/ajax/profile/group/queryGroupListByCreator" : {
		method: 'get',
		handler: [
			BaseController.prelog,
			GroupController.actionQueryGroupListByCreator
		]
	},
	"/ajax/group": {
		"/queryGroupListByCategory": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryGroupListByCategory
			]
		},
		"/applyGroup": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionApplyGroup
			]
		},
		"/queryGroupCategoryList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryGroupCategoryList
			]
		},
		"/queryWrapGroupCategoryList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryWrapGroupCategoryList
			]
		},
		"/queryRecommendGroupList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryRecommendGroupList
			]
		},
		"/getGroupInfo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionGetGroupInfo
			]
		},
		"/queryWaitForJoinGroupList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryWaitForJoinGroupList
			]
		},
		"/queryJoinedGroupList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryJoinedGroupList
			]
		},
		"/queryManageGroupListByStatus": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryManageGroupListByStatus
			]
		},
		"/getMyGroupInitData": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionGetMyGroupInitData
			]
		},
		"/applyJoinGroup": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionApplyJoinGroup
			]
		},
		"/cancelApplyJoin": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionCancelApplyJoin
			]
		},
		"/setGroupHead": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionSetGroupHead
			]
		},
		"/updateGroup": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionUpdateGroup
			]
		},
		"/deleteApplyGroup": {
			method: 'post',
			handler: [
				BaseController.prelog,
				GroupController.actionDeleteApplyGroup
			]
		},
		"/queryGroupListByNewActivity": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryGroupListByNewActivity
			]
		},
		"/inviteFriend": {
			method: 'post',
			handler: [
				BaseController.prelog,
				GroupController.actionInviteFriend
			]
		},
		"/setGroupAdmin": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionSetGroupAdmin
			]
		},
		"/verifyGroupMember": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionVerifyGroupMember
			]
		},
		"/leaveGroup": {
			method: 'post',
			handler: [
				BaseController.prelog,
				GroupController.actionLeaveGroup
			]
		},
		"/deleteGroupMember": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionDeleteGroupMember
			]
		},
		"/queryGroupMemberList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryGroupMemberList
			]
		},
		"/queryGroupAdminList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryGroupAdminList
			]
		},
		"/queryApplyList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryApplyList
			]
		},
		"/getActivityListByChannel": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionGetActivityListByChannel
			]
		},
		"/batchRemoveChannelActivity": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionBatchRemoveChannelActivity
			]
		},
		"/searchGroupMember": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionSearchGroupMember
			]
		},
		"/setNoticeStatus": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionSetNoticeStatus
			]
		},
		"/queryMyGroupList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				GroupController.actionQueryMyGroupList
			]
		}
	}
};
