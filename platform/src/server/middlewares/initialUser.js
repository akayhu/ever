"use strict";

import path from "path";
import PlatformMemberInitService from "../services/PlatformMemberInitService";
import IdentityService from '../services/IdentityService';
const platformMemberInitService = PlatformMemberInitService.getInstance();
const identityService = IdentityService.getInstance();
const InitialUser = () => (req, res, next) => {
	
	if(/\/sso\//g.test(req.originalUrl)){
		return next();
	}
	
	const userModel = req.userModel;

	let cookie;
	if(process.env.NODE_ENV === 'dev' && typeof req.query === 'object' && req.query.hasOwnProperty('IN')){
		cookie = req.query.IN;
		delete req.query.IN
	}else{
		cookie = req.cookies.IN;
	}
	
	if( userModel.isLogin && userModel.pid && userModel.pid !== -3 && !cookie ) {
		platformMemberInitService.initUser(userModel.pid, (result) => {
			if (result.hasOwnProperty('warning')) {
				console.error('InitialUser Middleware has something error', result);
				return res.redirect('/sso/saml-logout?r=/error/500/init');
			}
			if (result.response && result.response.isNewMember && !result.response.isInit) {
				console.error('InitialUser Middleware fail', result);
				return res.redirect('/sso/saml-logout?r=/error/500/init');
			}
			res.cookie('IN', true, {httpOnly: false, path: "/" });
			identityService.updateLoginInfo(userModel.pid, () => next());
		})
	}else {
		next();
	}
};
export default InitialUser;