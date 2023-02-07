"use strict";

import AsyncFetchHelper from 'async-fetch-helper';
import config from '../../configs/config';

class IdentityService {
	static getInstance() {
		if(!this.identityService){
			this.identityService = new IdentityService();
		}

		return this.identityService;
	}

	constructor() {
		this.identityService = null;
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
	}
	// 取得使用者登入資訊
	checkUser(params, callback) {
		let userModel = {
			pid : -3,
			status : null,
			loginId : null,
			loginTime : null,
		};
		
		if(!params.CS){
			return callback(userModel);
		}

		this.asyncFetchHelper.need(['rest']).then(function(rest){
			return [
					rest('post', config.params.apiUrl.esb + '/ac/getLoginInfo', { "ssoTokenId": params.CS, "returnAll" :true }, { "Content-Type": "application/json" })
			];
		}).end((results) => {
			const result = results[0];
				if(result.success === 'true' && result.data.Pid !== null && result.data.Status === 'login') {
					userModel.pid = result.data.Pid;
					userModel.status = result.data.Status;
					userModel.loginId = result.data.LoginId;
					userModel.loginTime = result.data.LoginTime;
				}
				callback(userModel);
		});
	}

	// 更新使用者登入資訊 for BO 報表
	updateLoginInfo(pid, callback) {
		try {
			this.asyncFetchHelper.need(['soap']).then((soap) => {
				return [
					soap('/MembershipService.0.0', (client) => {
						client.upInsertLoginTime({ pid });
					})
				];
			}).end((results) => {
				const result = results[0];
				console.log(`[upInsertLoginTime][${pid}] `, result);
				// 不論成功與否直接 pass
				callback();
			});
		} catch (e) {
			// 不論成功與否直接 pass
			console.warn(`[upInsertLoginTime][${pid}] soap has error`, e);
			callback();
		}
	}
}


export default IdentityService;
