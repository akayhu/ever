"use strict";

import SamlUtil, {webSaml, appSaml} from "../services/SamlUtil";
import IdentityService from '../services/IdentityService';
import PlatformMemberInitService from '../services/PlatformMemberInitService';
import PlatformAppService from '../services/PlatformAppService';
import config from '../../configs/config';

const identityService = IdentityService.getInstance();
const platformMemberInitService = PlatformMemberInitService.getInstance();
const platformAppService = PlatformAppService.getInstance();

const tmpDomain = config.params.domain; 

const checkCSLS = (cookies) => {
	return cookies.CS && cookies.LS && cookies.CS.length > 0 && cookies.LS.length > 0;
}
const goWithResult = (res, relayState, isLogout) => {
	switch(relayState.type){
		case 'app':
			const pid = relayState.pid;
			const deviceType = relayState.device_type;
			const deviceId = relayState.device_id;
			const pushToken = relayState.push_token;

			if(isLogout){
				delete relayState.pid;
				res.clearCookie('isDelMember', {maxAge: 1, httpOnly: false });
				res.clearCookie('pid', {maxAge: 1, httpOnly: false });
				res.clearCookie('UM', {domain: tmpDomain, maxAge: 1, httpOnly: true });
				res.clearCookie('SI', {maxAge: 1, httpOnly: true });
				
				return platformAppService.setLogoutInfo(pid, deviceType, deviceId, pushToken, (response) => {
					res.json(relayState);
				});
			}else{
				if(relayState.isDelMember === true){
					res.clearCookie('pid', {maxAge: 1, httpOnly: false });
					res.clearCookie('UM', {domain: tmpDomain, maxAge: 1, httpOnly: true });
					res.clearCookie('SI', {maxAge: 1, httpOnly: true });

					delete relayState.pid;
					delete relayState.CS;
					
					return res.json(relayState);
				}
				return platformAppService.setLoginInfo(pid, deviceType, deviceId, pushToken, (response) => {
					res.json(relayState);
				});
			}
			
		default:
			if(isLogout){
				res.clearCookie('isDelMember', {maxAge: 1, httpOnly: false });
				res.clearCookie('pid', {maxAge: 1, httpOnly: false });
				res.clearCookie('UM', {domain: tmpDomain, maxAge: 1, httpOnly: true });
				res.clearCookie('SI', {maxAge: 1, httpOnly: true });
			}
			return res.redirect(relayState.returnRef);
	}
}

export const actionLogin = (req, res, next) => {
	let params = {};
	let config = {};
	const paramMap = req.query;

	if(paramMap.hasOwnProperty('device_id') && paramMap.hasOwnProperty('device_type')){
		params.relay_state = SamlUtil.encodeRelayState({type: 'app', device_id: paramMap.device_id, device_type: paramMap.device_type, push_token: paramMap.push_token});
		config = appSaml;
	}else{
		var returnRef = paramMap.r || req.headers.referer || webSaml.settings.defReferer;

		if(!/^http.+/g.test(returnRef) && process.env.NODE_ENV === 'dev'){
			returnRef = req.headers.host + returnRef;
		}
		
		params.relay_state = SamlUtil.encodeRelayState({type: 'web', returnRef: returnRef});
		config = webSaml;
	}
	
	if( process.env.NODE_ENV === 'dev' ) return res.redirect('https://plus.104-dev.com.tw/sso/saml-login?r=/');

	SamlUtil.createLoginRequestUrl(config, params, (url) => {
		// url = url + '&fb_relay_state=' + params.relay_state;
		res.redirect(url);
	});
};

export const FBLogin = (req, res, next) => {
	let params = {};
	let config = {};
	const paramMap = req.query;

	if(paramMap.hasOwnProperty('device_id') && paramMap.hasOwnProperty('device_type')) {

		params.relay_state = SamlUtil.encodeRelayState({
													type: 'app',
													device_id: paramMap.device_id,
													device_type: paramMap.device_type,
													push_token: paramMap.push_token
												});
		config = appSaml;

	} else {
		var returnRef = paramMap.r || req.headers.referer || webSaml.settings.defReferer;

		if(!/^http.+/g.test(returnRef) && process.env.NODE_ENV === 'dev') {
			returnRef = req.headers.host + returnRef;
		}
		
		params.relay_state = SamlUtil.encodeRelayState({type: 'web', returnRef: returnRef});
		config = webSaml;
	}
	
	if( process.env.NODE_ENV === 'dev' ) return res.redirect('https://plus.104-dev.com.tw/sso/saml-login?r=');

	SamlUtil.createLoginRequestUrl(config, params, (url) => {
		url = url + '#/signinByFacebook';
		res.redirect(url);
	});
};

export const actionSignup = (req, res, next) => {
	let params = {};
	let config = {};
	const paramMap = req.query;
	
	if(paramMap.hasOwnProperty('device_id') && paramMap.hasOwnProperty('device_type')){
		params.relay_state = SamlUtil.encodeRelayState({type: 'app', device_id: paramMap.device_id, device_type: paramMap.device_type, push_token: paramMap.push_token});
		config = appSaml;
	}else{
		var returnRef = paramMap.r || req.headers.referer || webSaml.settings.defReferer;
		
		if(!/^http.+/g.test(returnRef) && process.env.NODE_ENV === 'dev'){
			returnRef = req.headers.host + returnRef;
		}
		
		params.relay_state = SamlUtil.encodeRelayState({type: 'web', returnRef: returnRef});
		config = webSaml;
	}
	
	SamlUtil.createLoginRequestUrl(config, params, (url) => {
		res.redirect(url + '#/signup');
	});
};

export const actionLogout = (req, res, next) => {
	const paramMap = req.query;

	let params = {name_id: '', session_index: req.cookies.SI};
	let config = {};
	
	if(paramMap.hasOwnProperty('device_id') && paramMap.hasOwnProperty('device_type')){
		const pid = req.cookies.pid;
		const relay_state = {type: 'app', pid: pid, device_id: paramMap.device_id, device_type: paramMap.device_type, "push_token": paramMap.push_token, "app_version": paramMap.app_version, "pic_size": paramMap.pic_size};

		if( !checkCSLS(req.cookies) ) {
			goWithResult(res, relay_state, true);
		}

		params.relay_state = SamlUtil.encodeRelayState(relay_state);
		config = appSaml;
	}else{
		var returnRef = paramMap.r || req.headers.referer || webSaml.settings.defReferer;
			
		if(!/^http.+/g.test(returnRef) && process.env.NODE_ENV === 'dev'){
			returnRef = req.headers.host + returnRef
		}

		const relay_state = {type: 'web', returnRef: returnRef};
		
		if( !checkCSLS(req.cookies) ) {
			goWithResult(res, relay_state, true);
		}

		params.relay_state = SamlUtil.encodeRelayState(relay_state);
		config = webSaml;
	}
	
	SamlUtil.createLogoutRequestUrl(config, params, (url) => {
		res.redirect(url);
	});
};
	
export const actionAfterLogout = (req, res, next) => {
	const paramMap = req.body;
	const relay_state = SamlUtil.dncodeRelayState(paramMap.RelayState);
	goWithResult(res, relay_state, true);
}
	
export const actionConsume = (req, res, next) => {
	const paramMap = req.body;
	const relay_state = SamlUtil.dncodeRelayState(paramMap.RelayState);
	const params = {CS: req.cookies.CS};
	const config = relay_state.type === 'app' ? appSaml : webSaml;

	// get cookie, checking it
	identityService.checkUser(params, (userModel) => {
		console.log('checkUser - userModel', userModel);
		console.log('paramMap', paramMap);
		// 登入成功
		if(userModel.pid !== null && userModel.status === 'login'){
			// cookie ok
			relay_state.pid = userModel.pid;
			relay_state.CS = req.cookies.CS;
			relay_state.LS = req.cookies.LS;

			SamlUtil.decodeSamlResponse(paramMap.SAMLResponse, (samlResponse)=>{
				if(samlResponse && samlResponse.SessionIndex) {
					res.cookie('SI', samlResponse.SessionIndex, { maxAge: (60 * 60 * 24 * 30 * 1000), httpOnly: true, path: "/" });
					relay_state.SI = samlResponse.SessionIndex;
				} 
				else return res.redirect(`/sso/saml-logout?r=${req.originalUrl}`);
			})
			
			// check pid status
			platformMemberInitService.checkUserInfo(userModel.pid, (result) => {
				
				// console.log(result);
				if(relay_state.type === 'app'){
					res.cookie('pid', userModel.pid, { maxAge: 900000, httpOnly: false, path: "/" });
				}

				// 取得會員資料過程有誤
				if(!result.success){
					relay_state.returnRef = '/sso/saml-logout?r=/error/500/init';
					console.error('checkUserInfo failed', result);
					goWithResult(res, relay_state);

				// 新會員
				} else if (result.isNewMember === true){
					console.log('new member in index server', result);

					// 如果是 App 就直接啟用
					if(relay_state.type === 'app'){
						platformMemberInitService.initUser(userModel.pid, (result) => {
							if (!result.response || result.hasOwnProperty('warning') || (!result.response.isInit && result.response.isNewMember)) {
								console.error('App Initial User Failed', result);
								goWithResult(res, relay_state);
							} else {
								identityService.updateLoginInfo(userModel.pid, () => goWithResult(res, relay_state));
							}
						})

					// pc、mobile 直接 pass
					//   - pc 在 client initial container 點啟用
					//   - mobile 在 m server initialUser middleware 直接啟用
					} else {
						goWithResult(res, relay_state);
					}
				
				// 舊會員
				} else {
					console.log('existing member', result)
					relay_state.isDelMember = result.isDelMember;
					
					if(relay_state.type === 'app'){
						res.cookie('isDelMember', result.isDelMember, { maxAge: 900000, httpOnly: false, path: "/" });
					}
					
					if(relay_state.isDelMember === true){
						relay_state.returnRef = '/sso/saml-logout?r=/error/404/member';
						goWithResult(res, relay_state);
					} else {
						identityService.updateLoginInfo(userModel.pid, () => goWithResult(res, relay_state));
					}
				}
			});
		}
		// 登入失敗
		else{
			// cookie fail, go to logout
			console.error("///////////loginFail///////////");
			console.error('request header', req.headers);
			console.error('userModel', userModel)
			console.error("/////////////////////////////////")
			relay_state.returnRef = '/sso/saml-logout?r=/';
			goWithResult(res, relay_state);
		}
	});
};