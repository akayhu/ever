"use strict";

import log4js from "log4js";

export const actionCode = (req, res, next) => {
	// const errorLog = log4js.getLogger("error");
	const paramMap = req.params;
	const realCode = paramMap.errorCode||500;
	let realMessage = "Internal server error";
	
	// /**************/
	// console.log("/**************Error from wap ErrorController.js**************/");
	// console.log("uri : " + req.originalUrl);
	// console.log("method : " + req.method);
	// console.log("header : ");
	// console.log(req.headers);
	// console.log("cookies : ");
	// console.log(req.cookies);
	// console.log("/**************/");
	// /**************/

	if(realCode/1 === 404){
		if(paramMap.error_status === 'member'){
			realMessage = "此帳號不存在或權限不足無法瀏覽";
		}else if(paramMap.error_status === 'group'){
			realMessage = "此社團不存在或權限不足無法瀏覽";
		}else if(paramMap.error_status === 'channel'){
			realMessage = "此頻道不存在或權限不足無法瀏覽";
		}else if(paramMap.error_status === 'activity'){
			realMessage = "此動態不存在或權限不足無法瀏覽";
		}else {
			realMessage = "page not found";
		}
	}else if(realCode/1 === 500){
		realMessage = paramMap.message||"Internal server error";
	}
	
	// errorLog.error(realMessage);
	
	req.passToLayoutState = {
		errorCode : realCode,
		errorMsg : realMessage
	};
	
	next();
};