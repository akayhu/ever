"use strict";

import ErrorMessageUtil from "../../util/ErrorMessageUtil";
var http = require('http');
var unirest = require('unirest');
var Promise = require('bluebird');
var connectionPool = null;
var agent = null;

export const setConnectionPool = (poolSetting) => {
	connectionPool = poolSetting;
	agent = new http.Agent(poolSetting);
}

export default function asyncBeApi(remoteDataUrl){
	return (req) => (store) => (next) => (action) => {
		if ( !action['CALL_API'] ) {
			return next(action);
		}
		
		if(!req.dataCheckPoint){
			req.dataCheckPoint = 1;
			req.dataCheckPointMap = {};
			req.keepCheckPointMapData = {};
		}else{
			req.dataCheckPoint++;
		}
		
		var dataCheckPoint = req.dataCheckPoint;
		req.dataCheckPointMap[dataCheckPoint] = false;

		var request = action['CALL_API'];
		var type = request.type;
		
		if(req.keepCheckPointMapData[type]){
			return new Promise(function promiseHandle(resolve, reject) {
				var result = req.keepCheckPointMapData[type];
				next({
					type: type,
					response: result
				});
				resolve(result);
			})
		}
		
		if(req.isAlreadyFetchData === true){
			return new Promise(function promiseHandle(resolve, reject) {
				var result = {};
				next({
					type: type,
					response: result
				});
				resolve(result);
			});
		}
		
		var method = request.method;
		var url = request.target;
		var host = request.host || '';
		var params = request.params || {};
		var header = request.header || {};
		
		method = method.toLowerCase();
		
		if(req.headers){
			if(req.headers.cookie){
				header["cookie"] = req.headers["cookie"];
			}
			
			if(req.headers['content-type']){
				header['content-type'] = req.headers['content-type'];
			}
			
			if(req.headers['user-agent']){
				header['user-agent'] = req.headers['user-agent'];
			}
			
			if(req.headers['accept-language']){
				header['accept-language'] = req.headers['accept-language'];
			}
			
			if(req.headers['origin']){
				header['origin'] = req.headers['origin'];
			}
		}
		
		url = "http:"+remoteDataUrl+'/ajax' + url;
		
		return new Promise(function promiseHandle(resolve, reject){
			var _request = unirest[method](url);
			
			if(agent){
				_request.options.agent = agent;
			}
			
			if(header.hasOwnProperty('cookie')){
				_request.options.headers.cookie = header.cookie;
				delete header.cookie;
			}
			
			if(Object.keys(header).length > 0){
				_request.headers(header);
			}

			_request.timeout(5000);
			
			switch(method){
				case 'get':
				case 'delete':
					_request.query(params);
					break;
					
				case 'post':
				case 'put':
					_request.send(params);
					break;
					
				default:
					break;
			}
			
			_request.end(function resultHandler(restResponse){
				console.log('restResponse', restResponse);
				
				if(req.isAlreadyFetchData === true){
					console.log("fetch data over time : "+url);
					return;
				}
				
				var result = restResponse.body || {response:{}};
				// console.log(url);
				// console.log(header.cookie);
				// console.log(header);
				// console.log(result);
				if(result.hasOwnProperty('errorCode')){
					
					ErrorMessageUtil(result, req);
					
					// result = {response:{}};
				}
				
				req.keepCheckPointMapData[type] = result;
				req.dataCheckPointMap[dataCheckPoint] = true;
				
				next({
					type: type,
					response: result
				});
				
				resolve(result);
			});
		});
	};		
};