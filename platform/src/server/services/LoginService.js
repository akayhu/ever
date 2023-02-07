"use strict";

import AESService from '../services/AESService';
import config from '../../configs/config';
const aesService = AESService.getInstance();
const tmpDomain = config.params.domain;

class LoginService {
	static getInstance() {
		if(!this.loginService){
			this.loginService = new LoginService();
		}

		return this.loginService;
	}

    constructor() {
		this.loginService = null;
	}

    clearCookies(res){
        res.clearCookie('UM', {domain: tmpDomain, maxAge: 1, httpOnly: true });
        res.clearCookie('SI', {maxAge: 1, httpOnly: true });
        res.clearCookie('isDelMember', {maxAge: -900000, httpOnly: false });
        res.clearCookie('pid', {maxAge: -900000, httpOnly: false });
    }

    getUserModel(cookie, callback){
        if( !cookie || process.env.NODE_ENV === 'dev') return callback(false);

        aesService.decrypt(cookie, (response) => {

            response = response.response.decrypted;
            if(!response || response.length === 0 ) return callback(false);
            else {
                const model = response.split(',');
                if(!model) return callback(false);
                return callback(model);
            }
        })
    }


}


export default LoginService;