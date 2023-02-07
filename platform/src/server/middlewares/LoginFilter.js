"use strict";

import path from "path";
import IdentityService from '../services/IdentityService';
import AESService from '../services/AESService';
import LoginService from '../services/LoginService';
import { actionLogin } from  '../controllers/SamlController';
import config from '../../configs/config';

const tmpDomain = config.params.domain;

const identityService = IdentityService.getInstance();
const aesService = AESService.getInstance();
const loginService = LoginService.getInstance();

const defaultModel = {
	pid: -3,
	userName: "",
	isLogin: false,
	loginTime: 0,
	CS: ""
};

const strategies = {
	'logout': (req, res, cb) => {
		loginService.clearCookies(res);
		return cb({...defaultModel});
	},
	'login': (req, res, cb) => {
		loginService.getUserModel(req.cookies.UM , function(UM){

			let result = { ...defaultModel};

			if(UM && UM.length >= 2 && UM[1] === req.cookies.CS) {
				result.pid = UM[0];
				result.isLogin = true;
				result.CS = req.cookies.CS;
				return cb(result);
			}else {
				return strategies.checkUserModel(req, res, cb);
			}
		})
	},
	'checkUserModel': (req, res, cb) => {
		let cookies = null;
		
		if((process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'lab') && typeof req.query === 'object' && req.query.hasOwnProperty('CS')){
			cookies = {
				CS: req.query.CS
			}
			delete req.query.CS
		}else{
			cookies = req.cookies;
		}
		
		identityService.checkUser({CS: cookies.CS}, (userModel) => {

			let result = { ...defaultModel};
			if(userModel.pid !== null && userModel.status === 'login'){
				result.pid = userModel.pid;
				result.isLogin = true;
				result.loginTime = userModel.loginTime;
				result.CS = cookies.CS;

				process.env.NODE_ENV !== 'dev' && aesService.encrypt(`${result.pid},${cookies.CS}`, (response) => {
					res.cookie('UM', response.response.encrypted, {domain: tmpDomain, httpOnly: true, path: "/" });
				})
			} else{
				return cb({ ...defaultModel});
			}

			return cb(result);
		})
	},
	'ACLogin': (req, res, cb) => {
		return cb(false);
	}
}

const getTicketByCookies = (cookies) => {
	if( !cookies.CS || !/^[0-9a-zA-Z]+$/.test(cookies.CS) ) return 'logout';
	else {
		if(!cookies.LS || cookies.LS.length === 0 || !cookies.SI || cookies.SI.length === 0 ) return 'ACLogin';
		if( !cookies.UM || cookies.UM.length === 0 ) return 'checkUserModel';
		else return 'login';
	}
}

const LoginFilter = () => (req, res, next) => {
	if(/\/sso\//g.test(req.originalUrl)){
		return next();
	}

	let cookies = null;
	
	if((process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'lab') && typeof req.query === 'object' && req.query.hasOwnProperty('CS')){
		cookies = {
			CS: req.query.CS
		};
	}else{
		cookies = req.cookies;
	}

	let ticket = getTicketByCookies(cookies);

	if( ticket === 'ACLogin' && process.env.NODE_ENV === 'dev') ticket = 'checkUserModel';

	strategies[ticket](req, res, (result) => {
		// if(!result) return actionLogin(req, res, next);

		if(!result) {
			const paramMap = req.query;
			if(paramMap.hasOwnProperty('device_id') && paramMap.hasOwnProperty('device_type')){
				return res.redirect(`/sso/saml-login?device_id=${paramMap.device_id}&device_type=${paramMap.device_type}`);
			} else {
				return res.redirect(`/sso/saml-login?r=${req.originalUrl}`);
			}
		}
		req.userModel = result;
		return next();
	});

};
export default LoginFilter;