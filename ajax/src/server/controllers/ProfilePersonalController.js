"use strict";

import ProfilePersonalService from 'src/server/services/ProfilePersonalService';

const profilePersonalService = ProfilePersonalService.getInstance();

export const actionUpdateUserIntroduction = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profilePersonalService.updateUserIntroduction(paramMap, (result) => {
		res.json(result);
	});
}

export const actionDeleteCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profilePersonalService.deleteCover(paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetUserInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profilePersonalService.getUserInfo(paramMap, (result) => {
		res.json(result);
	});
}

export const actionInitialUser = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profilePersonalService.initialUser(paramMap, (result) => {
		res.json(result);
	});
}

export const actionUpdateUserNameDisplay = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;

	profilePersonalService.updateUserNameDisplay(userModel.pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionUpdateCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profilePersonalService.updateCover(paramMap, (result) => {
		res.json(result);
	});
}

export const actionDeleteAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	profilePersonalService.deleteAvatar(paramMap, (result) => {
		res.json(result);
	});
}