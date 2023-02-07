"use strict";

import unirest from 'unirest';
import cookie from "cookie";

const RemoteFetchMiddleware = (testWord, remoteDataUrl, headers, callback) => (req, res, next) => {
	const re = new RegExp(testWord+"/.+");
	
	if(process.env.NODE_ENV === 'dev' && re.test(req.originalUrl)){
		var paramMap = {};
		var method = req.method.toLowerCase();
		var url = 'http:'+remoteDataUrl + req.originalUrl.replace(/\?.+/, '');
		var request = unirest[method](url);
		
		if(req.headers){
			if(req.headers.cookie){
				var cookieStr = Object.keys(req.cookies).reduce(function(ary, name, index){
					ary.push( cookie.serialize(name, String(req.cookies[name])) );
					return ary;
				},[]).join(";");
				request.options.headers.cookie = cookieStr;
			}
			
			if(req.headers['content-type']){
				request.options.headers['content-type'] = req.headers['content-type'];
			}
			
			if(req.headers['user-agent']){
				request.options.headers['user-agent'] = req.headers['user-agent'];
			}
			
			if(req.headers['accept-language']){
				request.options.headers['accept-language'] = req.headers['accept-language'];
			}
			
			if(req.headers['origin']){
				request.options.headers['origin'] = req.headers['origin'];
			}
		}
		
		switch(method){
			case 'get':
			case 'delete':
				if(Object.keys(req.query).length > 0){
					request.query(req.query);
				}
				break;
			case 'post':
			case 'put':
				if(Object.keys(req.body).length > 0){
					request.send(req.body);
				}
				break;
			default:break;
		}
		
		request.end(function resultHandler(restResponse){
			let result = {};
			
			if(callback){
				result = callback(restResponse);
			}else{
				if(restResponse && restResponse.hasOwnProperty('body')){
					result = restResponse.body;
				}else if(restResponse && restResponse.hasOwnProperty('error')){
					result.errorCode = 500;
					result.errorMsg = restResponse.error;
				}else{
					result.errorCode = 500;
					result.errorMsg = restResponse;
				}
			}
			
			req.remoteData = result;
			
			next();
		});
	}else{
		
		next();
	}
};

export default RemoteFetchMiddleware;