"use strict";

import ResponseService from 'src/server/services/ResponseService';

const responseService = ResponseService.getInstance();

export const testError = (req, res, next) => {
	const paramMap = req.paramMap;
	responseService.testError(paramMap, (result) => {
		res.json(result);
	});
}

export const testWarning = (req, res, next) => {
	const paramMap = req.paramMap;
	responseService.testWarning(paramMap, (result) => {
		res.json(result);
	});
}