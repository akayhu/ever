"use strict";

import PersonalConfigService from 'src/server/services/PersonalConfigService';
import AESService from 'src/server/services/AESService';
import {initialState as globalinitialState} from 'src/client/reducers/global';

const personalConfigService = PersonalConfigService.getInstance();
const aesService = AESService.getInstance();

export const actionDisConnect = (req, res, next) => {
	const paramMap = req.params;

	//pid and ts Must decode from AES
	const pid = paramMap.targetPid;
	const ts = paramMap.ts;
	
	req.reduxState = req.reduxState || {};
	req.reduxState.global = req.reduxState.global || globalinitialState;
	
	aesService.decrypt(ts, (resultTs) => {
		if(resultTs && resultTs.response && resultTs.response.decrypted){
			let currentTime = (new Date()).getTime();
			
			if (currentTime - resultTs.response.decrypted > 7*24*60*60*1000) {
				req.reduxState.global.done = {
					"msg": "連結已失效",
					"to": "/newsletter"
				};
				return next();
			}
			
			aesService.decrypt(pid, (resultPid) => {
				if(resultPid && resultPid.response && resultPid.response.decrypted){
					req.mtsPid = resultPid.response.decrypted/1;
					return next();
				}else{
					req.reduxState.global.done = {
						"msg": "系統忙碌中",
						"to": "/newsletter"
					};
					return next();
				}
			});	
		}else{
			req.reduxState.global.done = {
				"msg": "系統忙碌中",
				"to": "/newsletter"
			};
			return next();
		}
	});
};
	
export const updateMts = (req, res, next) => {
	const paramMap = req.params;
	const config = paramMap.config;
	const paramsConfig = {};
	const updateData = {};
	
	updateData.pid = req.mtsPid;
	updateData.type = config;
	updateData.value = 100;

	paramsConfig.updateData = JSON.stringify([updateData]);
	paramsConfig.pid = req.mtsPid;
	
	personalConfigService.updatePersonalConfig(paramsConfig, (result) => {
		if(result.errorCode){
			req.reduxState.global.done = {
				"msg": "系統忙碌中",
				"to": "/newsletter"
			};
			return next();
		}else if(result.response && result.response.warning){
			req.reduxState.global.done = {
				"msg": "系統忙碌中",
				"to": "/newsletter"
			};
			return next();
		}else{
			req.reduxState.global.done = {
				"msg": "訂閱已取消",
				"to": "/newsletter"
			};
			return next();
		}
	});
};