"use strict";

import ProfileNameCardService from 'src/server/services/ProfileNameCardService';

const profileNameCardService = ProfileNameCardService.getInstance();

export const actionGetNameCard = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileNameCardService.getNameCard(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetNameCardList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	profileNameCardService.getNameCardList(paramMap, (result) => {
		res.json(result);
	});
};