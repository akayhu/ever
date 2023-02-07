"use strict";

var c_platform = require('c_platform');
var ErrorMessageUtil = c_platform.server.utils.ErrorMessageUtil;

var errorTimer;
var errorCount = 0;

function recordError(){
	if (!errorTimer) {
		console.log('register error timer')
		errorTimer = setTimeout(() => {
			errorCount = 0;
			errorTimer = clearTimeout(errorTimer)
			console.log('reset error timer', { errorTimer, errorCount })
		}, 5000);
	}

	errorCount++;
	console.log('error count ++', { errorTimer, errorCount })
}

export const getErrorCount = () => {
	return errorCount;
};

const ErrorHandler = (type) => {
	switch(type) {
		case 404: {
			return (req, res, next) => {
				
				var error = new Error("Route match error : Cannot find route '"+req.originalUrl+"'");
				error.code = 404;
				
				ErrorMessageUtil(error, req);

				res.status(200).json({
					errorCode : 404,
					errorMsg : "Route match error : Cannot find route '"+req.originalUrl+"'"
				});
			};
		}
		default: {
			return (error, req, res, next) => {
				
				ErrorMessageUtil(error, req);
				
				switch(error.code) {
					case 401: {
						return res.status(200).json({
							errorCode : 401,
							errorMsg : error.message
						});
					}
					case 404: {
						return res.status(200).json({
							errorCode : 404,
							errorMsg : error.message,
							errorStack : error.stack
						});
					}
					case 500: {
						recordError();
						return res.status(200).json({
							errorCode : 500,
							errorMsg : error.message,
							errorStack : error.stack
						});
					}
					default: {
						recordError();
						return next();
					}
				}
			};
		}
	}
};

export default ErrorHandler;