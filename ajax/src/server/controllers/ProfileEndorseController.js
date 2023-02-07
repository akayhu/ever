"use strict";

import ProfileEndorseService from 'src/server/services/ProfileEndorseService';

const profileEndorseServiceInstance = ProfileEndorseService.getInstance();

export const actionGetEndorseList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	paramMap['targetPid'] = paramMap.targetPid || pid;
	paramMap['limit'] = paramMap.limit || 10;
	paramMap['offset'] = paramMap.offset || 0;
	paramMap['avatarLimit'] = paramMap.avatarLimit || 5;

	profileEndorseServiceInstance.getEndorseList(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetEndorseUserList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileEndorseServiceInstance.getEndorseUserList(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionUpdateEndorseSort = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.updateEndorseSort(paramMap, (result) => {
		res.json(result);
	});
};

export const actionUpdateEndorseDesc = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.updateEndorseDesc(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetEndorseTopList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.getEndorseTopList(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetEndorseSortList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileEndorseServiceInstance.getEndorseSortList(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetEndorseListExcludeTop = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.getEndorseListExcludeTop(paramMap, (result) => {
		res.json(result);
	});
};

export const actionDeleteEndorse = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.deleteEndorse(paramMap, (result) => {
		res.json(result);
	});
};

export const actionAddEndorseForUser = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.addEndorseForUser(paramMap, (result) => {
		res.json(result);
	});
};

export const actionCreateEndorse = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.createEndorse(paramMap, (result) => {
		res.json(result);
	});
};

export const actionRemoveEndorseForUser = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profileEndorseServiceInstance.removeEndorseForUser(paramMap, (result) => {
		res.json(result);
	});
};