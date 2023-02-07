"use strict";

import log4js from "log4js";

var c_platform = require('c_platform');
var ErrorMessageUtil = c_platform.server.utils.ErrorMessageUtil;

const normalLog = log4js.getLogger("normal");

export const json = function(state){
	
	if(state && state.hasOwnProperty("errorCode")){
		ErrorMessageUtil(state, null);
	}
	
	if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"){
		
		if(state && state.hasOwnProperty("errorCode") && state.hasOwnProperty("errorMsg")){
		
			var intCode = state.errorCode/1;
			var code = intCode/100;
			var testCode = Math.floor(code);
			
			if(testCode === 4){
				state.errorMsg = "Not Found";
			}else if(testCode === 5){
				state.errorMsg = "Internal server error";
			}
		}
		
		delete state.errorInfo;
		delete state.errorStack;
	}

	// state = JSON.stringify(state);
	
	// console.log(state);
	
	// state = JSON.parse(state);
	
	return this.jsonFunction(state);
};

export const prelog = (req, res, next) => {
	const reqParams = req.params || {};
	const reqBody = req.body || {};
	const reqQuery = req.query || {};

	

	const paramMap = {...reqParams, ...reqQuery, ...reqBody};
	// const userModel = req.userModel;
	// paramMap.pid = userModel.pid;

	if(process.env.NODE_ENV === "lab"){
		const info = {
			[req.originalUrl]: {
				method: req.method.toUpperCase(),
				paramMap: JSON.stringify(paramMap)
			}
		};
		normalLog.info(info);
	}
	
	req.paramMap = paramMap;

	if(req.paramMap.hasOwnProperty('browserTimeStamp')) delete req.paramMap.browserTimeStamp;
	res.jsonFunction = res.json;
	res.json = json;

	next();
};