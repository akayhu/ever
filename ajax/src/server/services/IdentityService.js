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
		this.asyncFetchHelper = new AsyncFetchHelper({});
	}

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

					this.asyncFetchHelper.need(['soap']).then(function(soap){
						return [
							soap('/PlatformAccountService.0.0', function handleAccountSoap(client){
								client.initial({
									pid: results[0].Pid
								});
							})
						];
					})
				}
				callback(userModel);
		});
	}
}


export default IdentityService;
