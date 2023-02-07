"use strict";

import AutoCompleteService from 'src/server/services/AutoCompleteService';

const autoCompleteService = AutoCompleteService.getInstance();

export const actionGetDescript = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	autoCompleteService.getDescript(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetACCompany = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	autoCompleteService.getAutoCompleteCompany(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetACJobtitle = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	autoCompleteService.getAutoCompleteJobtitle(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetACAbility = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	autoCompleteService.getAutoCompleteAbility(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetACSchool = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	autoCompleteService.getAutoCompleteSchool(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetACMajor = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	autoCompleteService.getAutoCompleteMajor(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetACArea = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	autoCompleteService.getAutoCompleteArea(paramMap, (result) => {
		res.json(result);
	});
};
