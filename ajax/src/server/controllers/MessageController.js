"use strict";

import MessageService from 'src/server/services/MessageService';
import IpUtil from 'src/server/utils/IpUtil';

const messageService = MessageService.getInstance();



export const actionGetMessageList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.getMessageList(pid, paramMap.count, (result) => {
		res.json(result);
	});
};

export const actionGetMessageListByTime = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.getMessageListByTime(pid, paramMap.count, paramMap.dateTime, (result) => {
		res.json(result);
	});
};

export const actionGetChatList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.getChatList(paramMap.chatId, pid, paramMap.count, paramMap.dateTime, (result) => {
		res.json(result);
	});
};

export const actionGetChatroomId = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.getChatroomId(pid, paramMap.memberList, (result) => {
		res.json(result);
	});
};

export const actionGetMemberIdList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.getMemberIdList(paramMap.chatId, (result) => {
		res.json(result);
	});
};

export const actionGetAllChatroomIdByPid = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.getAllChatroomIdByPid(pid, paramMap.count, (result) => {
		res.json(result);
	});
};

export const actionNewMessage = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.newMessage(pid, paramMap.memberList, paramMap.text, paramMap.extraJson, (result) => {
		res.json(result);
	});
};

export const actionNewMessageWithFile = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.newMessageWithFile(pid, paramMap.memberList, paramMap.text, paramMap.extraJson, (result) => {
		res.json(result);
	});
};

export const actionSendMessage = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.sendMessage(pid, paramMap.memberList, paramMap.text, paramMap.extraJson, (result) => {
		res.json(result);
	});
};

export const actionSetChatroomStatus = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.setChatroomStatus(paramMap.chatId, pid, (result) => {
		res.json(result);
	});
};

export const actionDeleteChatroomContent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.deleteChatroomContent(pid, paramMap.chatId, (result) => {
		res.json(result);
	});
};

export const actionDeleteMessage = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.deleteMessage(pid, paramMap.messageList, (result) => {
		res.json(result);
	});
};

export const actionSetChatroomMute = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.setChatroomMute(pid, paramMap.chatId, paramMap.muteFlag, (result) => {
		res.json(result);
	});
};

export const actionGetMessageBubbleCount = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.getMessageBubbleCount(pid, (result) => {
		res.json(result);
	});
};

export const actionSetMessageBubbleTime = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	messageService.setMessageBubbleTime(pid, (result) => {
		res.json(result);
	});
};

export const actionGetClientToken = (req, res, next) => {

	const paramMap = req.paramMap;
	const headerMap = req.headers;
	const userModel = req.userModel;
	const pid = userModel.pid;
	// const IpUtil = IpUtil();
	// const firstIP = IpUtil.split(',')[0];
	// const ip =  headerMap['x-forwarded-for'] || "";
	let clientIp = headerMap['x-forwarded-for'] || headerMap['x-real-ip'] || IpUtil() || req.connection.remoteAddress.replace(/.+\:/,"");
	// const firstIP = ip.split(',')[0];
	console.log('headerMap[x-forwarded-for]', headerMap['x-forwarded-for']);
	console.log('headerMap[x-real-ip]', headerMap['x-real-ip']);
	console.log('IpUtil()', IpUtil());
	console.log('req.connection.remoteAddress.replace(/.+\:/,"")', req.connection.remoteAddress.replace(/.+\:/,""));
	console.log('clientIp_', clientIp);
	clientIp = clientIp.split(',')[0];
	console.log('clientIp', clientIp);
	// console.log('remoteAddress', req.connection.remoteAddress);
	// console.log('req._peername', req.socket._peername.address.match(/\d+\.\d+\.\d+\.\d+/)[0]);
	// console.log('req.headers[x-forwarded-for]', req.headers['x-forwarded-for']);
	// console.log('req', req);
	// console.log('res', res);
	// const peernameAddress = req.socket._peername.address.match(/\d+\.\d+\.\d+\.\d+/)[0];
	// const reqIp = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
	// const connectionRemoteAddress = req.connection.remoteAddress.match(/\d+\.\d+\.\d+\.\d+/)[0];
	// const socketRemoteAddress = req.socket.remoteAddress.match(/\d+\.\d+\.\d+\.\d+/)[0];
	// const clientIp = peernameAddress || headerMap['x-forwarded-for'] || reqIp || connectionRemoteAddress || socketRemoteAddress || '';

	messageService.getClientToken(pid, clientIp, (result) => {
		res.json(result);
	});
};

export const actionGetChatroomMuteStatus = (req, res, next) => {
		const paramMap = req.paramMap;
		const userModel = req.userModel;
		const pid = userModel.pid;
		const chatId = paramMap.chatId

		messageService.getChatroomMuteStatus(pid, chatId, (result) => {
			res.json(result);
		});
	};