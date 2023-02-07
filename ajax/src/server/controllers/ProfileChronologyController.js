"use strict";

import ProfileChronicleService from 'src/server/services/ProfileChronicleService';

const profileChronicleService = ProfileChronicleService.getInstance();

export const actionGetEduExpMixedList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.getEduExpMixedList(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionGetFullEventForAnalysis = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.getFullEventForAnalysis(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionGetRecentEventList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.getRecentEventList(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionCreateExpEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.createExpEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionCreateEduEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.createEduEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionCreateHonorEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.createHonorEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionDeleteExpEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.deleteExpEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionDeleteEduEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.deleteEduEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionDeleteHonorEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.deleteHonorEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionDeleteEventByPid = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.deleteEventByPid(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionUpdateExpEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.updateExpEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionUpdateEduEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.updateEduEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionUpdateHonorEvent = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.updateHonorEvent(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionUpdateEventPrivacySetting = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileChronicleService.updateEventPrivacySetting(paramMap, (result) => {
		res.json(result);
	});
};
	
export const actionGetChronicleExp = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	
	profileChronicleService.getChronicleExp(userModel.pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetChronicleEdu = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	
	profileChronicleService.getChronicleEdu(userModel.pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetChronicleHonor = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	
	profileChronicleService.getChronicleHonor(userModel.pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetChronicleAll = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	
	profileChronicleService.getChronicleAll(userModel.pid, paramMap, (result) => {
		res.json(result);
	});
};