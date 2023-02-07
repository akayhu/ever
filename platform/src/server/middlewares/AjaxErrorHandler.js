"use strict";

import ErrorMessageUtil from "../../util/ErrorMessageUtil"

const AjaxErrorHandler = (prefix, pattern) => (error, req, res, next) => {
	if(/ajax.+/gi.test(req.originalUrl)){
		
		ErrorMessageUtil(error, req);
		
		switch(error.code) {
			case 401: {
				if(pattern && pattern[401]){
					return pattern[401](error, req, res, next);
				}else{
					return res.status(200).json({
						errorCode : 401,
						errorMsg : error.message
					});
				}
			}
			case 404: {
				if(pattern && pattern[404]){
					return pattern[404](error, req, res, next);
				}else{
					return res.status(200).json({
						errorCode : 404,
						errorMsg : error.message,
						errorStack : error.stack
					});
				}
			}
			case 405: {
				if(pattern && pattern[405]){
					return pattern[405](error, req, res, next);
				}else{
					return res.status(200).json({
						errorCode : 405,
						errorMsg : error.message,
						errorStack : error.stack
					});
				}
			}
			default: {
				if(pattern && pattern[500]){
					return pattern[500](error, req, res, next);
				}else{
					return res.status(200).json({
						errorCode : 500,
						errorMsg : error.message,
						errorStack : error.stack
					});
				}
			}
		}
	}
	
	next(error);
};

export default AjaxErrorHandler;