"use strict";

import AccessRecordService from 'src/server/services/AccessRecordService';

const accessRecordService = AccessRecordService.getInstance();

export const actionViewActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accessRecordService.viewActivity(paramMap, (result) => {
		res.json(result);
	});
};

export const actionQueryActivityTotalPvByAuthor = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accessRecordService.queryActivityTotalPvByAuthor(paramMap, (result) => {
		res.json(result);
	});
};

export const actionQueryViewerFromPro = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	accessRecordService.queryViewerFromPro(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionQueryViewer = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	accessRecordService.queryViewer(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionQueryViewerCount = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;

	accessRecordService.queryViewerCount(paramMap, (result) => {
		res.json(result);
	});
};

export const actionViewProfile = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accessRecordService.viewProfile(paramMap, (result) => {
		res.json(result);
	});
};

export const actionQueryActivityTotalPv = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accessRecordService.queryActivityTotalPv(paramMap, (result) => {
		res.json(result);
	});
};

export const actionViewProfileFromPro = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	accessRecordService.viewProfileFromPro(pid, (result) => {
		res.json(result);
	});
};

export const actionQueryViewCountFromPro = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accessRecordService.queryViewCountFromPro(paramMap, (result) => {
		res.json(result);
	});
};
