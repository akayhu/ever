"use strict";

import SamlUtil, {webSaml, appSaml} from "../services/SamlUtil";
import IdentityService from '../services/IdentityService';
import PlatformMemberInitService from '../services/PlatformMemberInitService';
import PlatformAppService from '../services/PlatformAppService';

const identityService = IdentityService.getInstance();
const platformMemberInitService = PlatformMemberInitService.getInstance();
const platformAppService = PlatformAppService.getInstance();
const goWithResult = (res, relayState) => {
	switch(relayState.type){
		case 'app':
			const pid = relayState.pid;
			const deviceType = relayState.device_type;
			const deviceId = relayState.device_id;
			const pushToken = relayState.push_token;
		
			if(relayState.isDelMember === true){
				res.clearCookie('pid', {maxAge: -900000, httpOnly: false });
				res.clearCookie('UM', {maxAge: -900000, httpOnly: true });
				delete relayState.pid;
				delete relayState.CS;
			}
			
			return platformAppService.setLoginInfo(pid, deviceType, deviceId, pushToken, (response) => {
				// console.log(res)
				res.json(relayState);
			});
		
		default:
			return res.redirect(relayState.returnRef);
	}
};

export const actionConsume = (req, res, next) => {
	const paramMap = req.query;

	// const relay_state = {type: "web", returnRef: webSaml.settings.defReferer};
	const relay_state = SamlUtil.dncodeRelayState(paramMap.relay_state);

	const cookie = req.cookies.CS;
	const params = {CS: cookie};
	const config = webSaml;
	//const config = relay_state.type === 'app' ? appSaml : webSaml;
	
	// get cookie, checking it
	identityService.checkUser(params, (userModel) => {	

		// 登入成功
		if(userModel.pid !== null && userModel.status === 'login'){
			// cookie ok
			relay_state.pid = userModel.pid;
			relay_state.CS = cookie;
			
			// check pid status
			platformMemberInitService.checkUserInfo(userModel.pid, (result) => {
				if(relay_state.type === 'app'){
					res.cookie('pid', userModel.pid, { maxAge: 900000, httpOnly: false, path: "/" });
				}
				
				// 取得會員資料過程有誤
				if(!result.success){
					relay_state.returnRef = '/sso/saml-logout?r=/error/500/init';
					console.log(result);
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
				}
				// 舊會員
				else{
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
			relay_state.returnRef = '/sso/saml-logout?r=/';
			goWithResult(res, relay_state);
		}
	});
};