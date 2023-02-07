"use strict";

import log4js from "log4js";

const normalLog = log4js.getLogger("normal") || null;
const warningLog = log4js.getLogger("warning") || null;
const errorLog = log4js.getLogger("error") || null;

export default function ErrorMessageUtil(error, req){
	var errorMessage = {};
	var intCode = 500;
	var code = intCode/100;
	var testCode = Math.floor(code);
	
	if(error.hasOwnProperty("errorCode") && error.errorCode){
		error.code = error.errorCode;
	}
	
	if(req){
		errorMessage = {
			url : req.originalUrl,
			method : req.method,
			query : req.query,
			body : req.body,
			params : req.params, 
			ip: req.headers["x-forwarded-for"] || req.headers['x-real-ip'] || "",
			referer: req.headers.referer || "",
			header : req.headers,
			cookies : req.cookies,
			error : error,
		};
		
		intCode = error.code/1;
		code = intCode/100;
		testCode = Math.floor(code);
	}else{
		
		if(error.code){
			intCode = error.code/1;
			code = intCode/100;
			testCode = Math.floor(code);
		}
		
		errorMessage = {
			uncaughtException : error,
		};
	}
	
	if(testCode === 4 && intCode !== 401){
		warningLog && warningLog.warn(errorMessage);
	}else if(testCode === 5){
		errorLog && errorLog.error(errorMessage);
	}
	
	// /**************/
	// console.log("/**************Error from ErrorHandler.js**************/");
	// console.log("uri : " + req.originalUrl);
	// console.log("method : " + req.method);
	// console.log("header : ");
	// console.log(req.headers);
	// console.log("cookies : ");
	// console.log(req.cookies);
	// console.log("error :");
	// console.log(error);
	// console.log("/**************/");
	// /**************/
}