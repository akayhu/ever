"use strict";

import NotificationService from 'src/server/services/NotificationService';

const notificationService = NotificationService.getInstance();

export const actionGetMixListByAction = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	const type = paramMap.type || 2;
	const action = paramMap.action || 0;
	const count = paramMap.count || 10;
	const dateTime = paramMap.dateTime;

	notificationService.getMixListByAction(pid, type, action, count, dateTime, (result) => {
		res.json(result);
	});
};

export const actionGetNotifictionByPid = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	const jsonData = req.paramMap || {};
	notificationService.getNotifictionByPid(pid, jsonData, (result) => {
		res.json(result);
	});
};

export const actionGetBubbleCountByAction = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	const action = paramMap.action || 0;
	
	notificationService.getBubbleCountByAction(pid, action, (result) => {
		res.json(result);
	});
};

export const actionGetBubbleCount = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	notificationService.getBubbleCount(pid, (result) => {
		res.json(result);
	});
};

export const actionSetBubbleTimeByType = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;	
	// 通知紅泡類型：1=connection、2=message、3=notification、4=c2bnotification、5=plusMail、6=broadcast、7=whoseeme、8=bccommunication
	const type = paramMap.type || 3;
	
	notificationService.setBubbleTimeByType(pid, type, (result) => {
		res.json(result);
	});
};

export const actionUpdateAllStatusById = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	notificationService.updateAllStatusById( paramMap, (result) => {
		res.json(result);
	});
}

export const actionUpdateMixListAllReadByType = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;	
	const type = paramMap.type || 3;
	
	notificationService.updateMixListAllReadByType(pid, type, (result) => {
		res.json(result);
	});
};

export const actiongetMixList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;	
	const type = paramMap.type || 1;
	const count = paramMap.count || 15;
	const dateTime = paramMap.dateTime;
	
	notificationService.getMixList(pid, type, count, dateTime, (result) => {
		res.json(result);
	});
};

export const actionSend2User = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	notificationService.send2User(paramMap, (result) => {
		res.json(result);
	});
};