"use strict";

import ProfileAppraiseService from 'src/server/services/ProfileAppraiseService';

const profileAppraiseService = ProfileAppraiseService.getInstance();

export const actionQueryAppraiseList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

  const {count, targetPid, timeInMillis, limit, sortByPid = 1} = paramMap;

	profileAppraiseService.queryAppraiseList(pid, count, targetPid, timeInMillis, limit, sortByPid, (result) => {
		res.json(result);
	});
}

export const actionQueryAppraiseListOfOwner = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

  const {targetPid, timeInMillis, limit} = paramMap;

	profileAppraiseService.queryAppraiseListOfOwner(pid, targetPid, timeInMillis, limit, (result) => {
		res.json(result);
	});
}

export const actionAddAppraiseText = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileAppraiseService.addAppraiseText(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionQueryAppraisePendingList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

  const {targetPid, timeInMillis, limit} = paramMap;

	profileAppraiseService.queryAppraiseePendingList(pid, targetPid, timeInMillis, limit, (result) => {
		res.json(result);
	});
}

export const actionDeleteAppraiseText = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;

	profileAppraiseService.deleteAppraiseText(paramMap.pid, userModel.pid, (result) => {
		res.json(result);
	});
}

export const actionPublishAppraiseText = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;

	profileAppraiseService.publishAppraiseText(paramMap.pid, userModel.pid, paramMap.privacySetting, (result) => {
		res.json(result);
	});
}