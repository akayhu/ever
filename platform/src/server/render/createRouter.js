"use strict";

import express from 'express';
import async from 'async';
import getParameterNames from "get-parameter-names";
import RequireByFormat from "../../util/RequireByFormat";

function fixArgs(req, action) {
	try {
		const reqParams = req.params || {};
		const reqBody = req.body || {};
		const reqQuery = req.query || {};
		const actionArgs = [];
		const args = getParameterNames(action);
		const argsMerge = {...reqParams, ...reqQuery, ...reqBody};

		let paramMap = args.reduce(function(newObj, value, index){
			var paramName = value;
			
			if(argsMerge.hasOwnProperty(paramName)){
				actionArgs.push(argsMerge[paramName]);
				newObj[paramName] = argsMerge[paramName];
			}else{
				actionArgs.push(null);
				newObj[paramName] = null;
			}
			
			delete argsMerge[paramName];
			
			return newObj;
		}, {});
		
		paramMap = {...paramMap, ...argsMerge};
		
		return {paramMap: paramMap, actionArgs: actionArgs};
	}catch(e){
		throw e;
	}
}

function handlerCreator(url, handler, routeOtherSetting) {
	if(!handler){
		handler = [];
	}else if(typeof handler === 'function'){
		handler = [handler]
	}else if(!Array.isArray(handler)){
		throw new Error("handler type error"+(url?"; url: "+url:""));
	}
	
	return (req, res, next) => {
		if(req.ignore === true){
			return next();
		}
		
		req.ignore = true;
		req.login = routeOtherSetting.login || false;
		req.layout = routeOtherSetting.layout || "";
		
		if(req.login === true && req.userModel.isLogin === false){
			return next({
				code: 401,
				message: "Not login; Url : "+req.originalUrl,
				stack: {}
			});
		}
		
		try{
			async.eachSeries(handler, function eachProxy(mw, cb){
				mw(req, res, cb);
			}, next);
		}catch(e){
			return next({
				code: 500,
				message: e.message,
				stack: e.stack
			});
		}
	};
}

const createRouter = (routes) => {
	if(routes.hasOwnProperty("method")){
		let method = routes.method;
		let handler = routes.handler;
		
		return handlerCreator('', handler, routes);
	}
	
	const router = express.Router();
	
	for(let url in routes){
		const pattern = routes[url];
		
		if(Array.isArray(pattern)){
			pattern.map((route) => {
				let method1 = route.method;
				let handler = route.handler;
				
				router[method1](url, handlerCreator(url, handler, route));
			})
		}else if(typeof pattern === 'object'){
			let method2 = pattern.method;
			let handler = pattern.handler;
			
			router[method2](url, handlerCreator(url, handler, pattern));
		}
	}
	
	return router;
};

export default createRouter;