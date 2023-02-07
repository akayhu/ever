"use strict";

import * as BaseController from "src/server/commons/BaseController";
import * as MessageController from "src/server/controllers/MessageController";

export default {
	"/ajax/message": {
		"/getMessageList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetMessageList
			]
		},
		"/getMessageListByTime": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetMessageListByTime
			]
		},
		"/getChatList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetChatList
			]
		},
		"/getChatroomId": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetChatroomId
			]
		},
		"/getMemberIdList": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetMemberIdList
			]
		},
		"/getAllChatroomIdByPid": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetAllChatroomIdByPid
			]
		},
		"/newMessage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				MessageController.actionNewMessage
			]
		},
		"/newMessageWithFile": {
			method: 'post',
			handler: [
				BaseController.prelog,
				MessageController.actionNewMessageWithFile
			]
		},
		"/sendMessage": {
			method: 'post',
			handler: [
				BaseController.prelog,
				MessageController.actionSendMessage
			]
		},
		"/setChatroomStatus": {
			method: 'all',
			handler: [
				BaseController.prelog,
				MessageController.actionSetChatroomStatus
			]
		},
		"/deleteChatroomContent": {
			method: 'all',
			handler: [
				BaseController.prelog,
				MessageController.actionDeleteChatroomContent
			]
		},
		"/deleteMessage": {
			method: 'all',
			handler: [
				BaseController.prelog,
				MessageController.actionDeleteMessage
			]
		},
		"/setChatroomMute": {
			method: 'all',
			handler: [
				BaseController.prelog,
				MessageController.actionSetChatroomMute
			]
		},
		"/getMessageBubbleCount": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetMessageBubbleCount
			]
		},
		"/setMessageBubbleTime": {
			method: 'all',
			handler: [
				BaseController.prelog,
				MessageController.actionSetMessageBubbleTime
			]
		},
		"/getChatroomMuteStatus": {
			method: 'get',
			handler: [
				BaseController.prelog,
				MessageController.actionGetChatroomMuteStatus
			]
		}
	},
	"/ajax/getClientToken": {
		method: 'get',
		handler: [
			BaseController.prelog,
			MessageController.actionGetClientToken
		]
	}
};