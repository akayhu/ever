"use strict";

import AsyncFetchHelper from 'async-fetch-helper';
import config from '../../configs/config';

class PlatformAppService {
	static getInstance() {
		if(!this.platformAppService){
			this.platformAppService = new PlatformAppService();
		}
		
		return this.platformAppService;
	}
	
	constructor() {
		this.platformAppService = null;
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
	}
	
	getLoginRecord(pid, callback) {
		this.asyncFetchHelper.need(['soap']).then((soap) => {
			return [
				soap('/PlatformAppService.0.0', (client) => {
					client.getLoginRecord({
						'productKey' : config.params.apnum , 
						'pid' : pid
					});
				})
			];
		}).end((results) => {
			callback(results[0].response);
		});
	}
	
	setLoginInfo(pid, deviceType, deviceId, pushToken, callback) {
		this.asyncFetchHelper.need(['soap']).then((soap) => {
			return [
				soap('/PlatformAppService.0.0', (client) => {
					client.setLoginInfo({
						'productKey' : config.params.apnum , 
						'pid' : pid,
						'deviceType' : deviceType,
						'deviceId' : deviceId,
						'pushToken' : pushToken
					});
				})
			];
		}).end((results) => {
			callback(results[0].response);
		});
	}
	
	setLogoutInfo(pid, deviceType, deviceId, pushToken, callback) {
		this.asyncFetchHelper.need(['soap']).then((soap) => {
			return [
				soap('/PlatformAppService.0.0', (client) => {
					client.setLogoutInfo({
						'productKey' : config.params.apnum , 
						'pid' : pid,
						'deviceType' : deviceType,
						'deviceId' : deviceId,
						'pushToken' : pushToken
					});
				})
			];
		}).end((results) => {
			callback(results[0].response);
		});
	}
}

export default PlatformAppService;