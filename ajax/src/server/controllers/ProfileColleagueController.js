"use strict";

import ProfileColleagueService from 'src/server/services/ProfileColleagueService';

const profileColleagueService = ProfileColleagueService.getInstance();

export const actionQueryColleagueList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	profileColleagueService.queryColleagueList(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionColleagueWishStatus = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileColleagueService.colleagueWishStatus(pid, paramMap.targetPid, (result) => {
		res.json(result);
	});
}

export const actionAddColleague = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileColleagueService.addColleague(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionRemoveColleague = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileColleagueService.removeColleague(pid, paramMap.targetPid, (result) => {
		res.json(result);
	});
}