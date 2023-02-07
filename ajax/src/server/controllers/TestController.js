"use strict";

import TestService from 'src/server/services/TestService';

const testService = TestService.getInstance();

export const actionCheckPjAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.checkPjAPI(pid, (result) => {
		res.json(result);
	});
};

export const actionAnswerPjAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.answerPjAPI(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionReportBrandPjAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.reportBrandPjAPI(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionCheckPoAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.checkPoAPI(pid, (result) => {
		res.json(result);
	});
};

export const actionAnswerPoAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.answerPoAPI(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionReportBrandPoAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.reportBrandPoAPI(pid, paramMap, (result) => {
		res.json(result);
	});
};;

export const actionCheckPiAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.checkPiAPI(pid, (result) => {
		res.json(result);
	});
};

export const actionAnswerPiAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.answerPiAPI(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionReportBrandPiAPI = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	testService.reportBrandPiAPI(pid, paramMap, (result) => {
		res.json(result);
	});
};