"use strict";
import Pusher from 'pusher';
import NotificationService from 'src/server/services/NotificationService';
import clientConfig from 'src/configs/client';

const notificationService = NotificationService.getInstance();

const pusherConstructor = new Pusher({
	appId: clientConfig.params.pusher.appId,
	key: clientConfig.params.pusher.key,
	secret: (clientConfig.env !== 'dev') ? process.env.PUSHER_SECRET : clientConfig.params.pusher.secret,
	cluster: clientConfig.params.pusher.cluster,
	encrypted: true
});

export const actionAuth = (req, res, next) => {
	const socketId = req.body.socket_id;
	const channel = req.body.channel_name;
	
	const auth = pusherConstructor.authenticate(socketId, channel);
    res.json(auth);
}

export const actionGetNotiByPid = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	notificationService.getNotifictionByPid(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetUnreadNotify = (req, res, next) => {
	const userModel = req.userModel;
	const pid = userModel.pid;

	notificationService.getUnreadNotiffy(pid, (result) => {
		res.json(result);
	})
}