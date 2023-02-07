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
		// params.CS = "fe05308cb1b9448992dad7f65fc17e59"
		if(!params.CS){
			return callback(userModel);
		}

        this.asyncFetchHelper.need(['rest']).then(function(rest){
            return [
                rest('post', config.params.apiUrl.esb + '/ac/getLoginInfo', { "ssoTokenId": params.CS, "returnAll" :true }, { "Content-Type": "application/json" })
            ];
        }).end(function(results){
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
}


export default IdentityService;
