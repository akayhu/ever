"use strict";

import AccountService from 'src/server/services/AccountService';

const accountService = AccountService.getInstance();

export const actionInitial = (req, res, next) => {
	const paramMap = req.paramMap;
	// const userModel = req.userModel;
	// const pid = userModel.pid;
	
	accountService.initial(paramMap.pid, (result) => {
		// res.json(result);
		req.paramMap.initial = result;
		next();
	});
};

export const actionUpInsertLoginInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const targetPid = paramMap.pid;

	accountService.upInsertLoginTime(targetPid, result => {
		console.log(`[upInsertLoginTime][${targetPid}] `, result);
		res.json(paramMap.initial);
	});
}

export const actionName = (req, res, next) => {
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	accountService.name(pid, (result) => {
		res.json(result);
	});
};

export const actionGetEmailInfoByPid = (req, res, next) => {
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	accountService.getEmailInfoByPid(pid, result => {
		res.json(result);
	});
};

export const actionGetAccountStatus = (req, res, next) => {
	const paramMap = req.paramMap;
	const targetPid = paramMap.pid;

	accountService.confirmProcess(targetPid, result => {
		res.json(result);
	});
}

export const actionGetMembershipInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const targetPid = paramMap.pid;

	accountService.getMembershipInfo(targetPid, result => {
		res.json(result);
	});
}
