"use strict";

import Promise from 'bluebird';
import Superagent from 'superagent';
import browser from 'browser-detect';


export default function asyncFeApi(remoteDataUrl){
	return (store) => (next) => (action) => {
		if ( !action['CALL_API'] ) {
			return next(action);
		}
		
		const request = action['CALL_API'];
		const type = request.type;
		const host = request.host || remoteDataUrl || '';
		const header = request.header || {};
		let httpMethod = request.method;
		let target = request.target;
		let params = request.params || {};
		let namespace = '';

		if(/\:.+/.test(target)){
			const targetArray = target.split('/');
			let namespaceAry = [];
		
			targetArray.map(function spaceHandle(space){
				if(space){
					if(/\:.+/.test(space)){
						const name = space.replace(':', '');
						
						if(params[name]){
							namespaceAry.push(params[name]);
							delete params[name];
						}
					}else{
						namespaceAry.push(space);
					}
				}
			});
			
			namespace = '/' + namespaceAry.join('/');
		}else{
			namespace = target;
		}		
		
		var remote = {};
		if(window.env === 'dev'){
			var cs = store.getState().user.CS;
			remote = {"CS":cs};
		}
		
		return new Promise(function promiseHandle(resolve, reject){
			
			function responseCallback(responseError, response){				
				let result = {};
				
				if(responseError !== null && typeof responseError !== 'undefined'){
					result = {
						error: responseError
					};
				}else{
					try{
						result = response.body;
					}catch(bodyError){
						result = {
							error: bodyError
						};
					}
				}
				
				next({
					type: type,
					response: result
				});
				
				resolve(result);
			}
			
			httpMethod = httpMethod.toLowerCase();
			target = '/ajax' + namespace;
			
			if(host){
				target = host + '/ajax' + namespace;
			}

			if(browser().name === 'ie') {
				var date = new Date();
				params.browserTimeStamp = date.getTime();
			}
			
			switch(httpMethod){
				case 'get':
					params = Object.assign({}, params, remote);
					Superagent.get(target).query(params).set(header).end(responseCallback);
					break;
					
				case 'post':
					Superagent.post(target).query(remote).send(params).set(header).end(responseCallback);
					break;
					
				case 'put':
					Superagent.put(target).query(remote).send(params).set(header).end(responseCallback);
					break;
					
				case 'delete':
					params = Object.assign({}, params, remote);
					Superagent.del(target).query(params).set(header).end(responseCallback);
					break;
			}
		});
	};
};