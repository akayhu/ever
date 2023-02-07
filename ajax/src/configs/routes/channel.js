"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as ChannelController from "src/server/controllers/ChannelController";

export default {
	"/ajax/mediaChannel": {
		"/getMediaList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionGetMediaList
			]
		},
		"/getSubscribeMediaList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionGetSubscribeMediaList
			]
		},
		"/subscribeMedia": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ChannelController.actionSubscribeMedia
			]
		},
		"/unsubscribeMedia": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ChannelController.actionUnsubscribeMedia
			]
		},
		"/getMediaListByNewActivity": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionGetMediaListByNewActivity
			]
		},
		"/addMediaRole": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ChannelController.actionAddMediaRole
			]
		},
		"/deleteMediaRole": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ChannelController.actionDeleteMediaRole
			]
		},
		"/getMediaInfo": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionGetMediaInfo
			]
		},
		"/updateMedia": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ChannelController.actionUpdateMedia
			]
		},
		"/inviteSubscribeMedia": {
			method: 'post',
			handler: [
				BaseController.prelog,
				ChannelController.actionInviteSubscribeMedia
			]
		},
		"/getMediaMemberList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionGetMediaMemberList
			]
		},
		"/getMediaAdminList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionGetMediaRoleList
			]
		},
		"/searchMediaMember": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionSearchMediaMember
			]
		},
		"/getChannIdByNameUrl": {
			method: 'get',
			handler: [
				BaseController.prelog,
				ChannelController.actionGetChannIdByNameUrl
			]
		}
	}
};
