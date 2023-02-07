"use strict";

import PersonalConfigService from 'src/server/services/PersonalConfigService';

const personalConfigService = PersonalConfigService.getInstance();

export const actionSyncPersonalConfig = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	personalConfigService.syncPersonalConfig(paramMap, (result) => {
		res.json(result);
	});
};

export const actionQueryPersonalConfigByPid = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	personalConfigService.queryPersonalConfigByPid(paramMap, (result) => {
		res.json(result);
	});
};

export const actionQueryPersonalConfigByPidAndType = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	personalConfigService.queryPersonalConfigByPidAndType(paramMap, (result) => {
		res.json(result);
	});
};

export const actionUpdatePersonalConfig = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	personalConfigService.updatePersonalConfig(paramMap, (result) => {
		res.json(result);
	});
};