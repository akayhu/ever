"use strict";

import saml2 from 'saml2-js';
import {Base64} from 'js-base64';
import deepAssign from "deep-assign";
import clientConfig from "../../configs/client";

var parseString = require('xml2js').parseString;

function createSpIdp(settings, type){
	let config = {
		settings : settings
	};
	
	const sp_options = {
		entity_id: config.settings.issuer,
		private_key: '',
		certificate: '',
		assert_endpoint: config.settings.endpoint
	};
	
	const idp_options = {
		sso_login_url: config.settings.loginUrl,
		sso_logout_url: config.settings.logoutUrl,
		certificates: ['','']
	};
	
	config.sp = new saml2.ServiceProvider(sp_options);
	config.idp = new saml2.IdentityProvider(idp_options);
	
	return config;
}

class SamlUtil {

	static decodeSamlResponse(response, callback) {
		try{
			parseString(Base64.decode(response), (err, result) => {
				console.log(result);
				var ret = {
					NameID: '',
					SessionIndex: ''
				};
				ret.NameID = result['saml2p:Response']['saml2:Assertion'][0]['saml2:Subject'][0]['saml2:NameID'][0]._;
				ret.SessionIndex = result['saml2p:Response']['saml2:Assertion'][0]['saml2:AuthnStatement'][0].$.SessionIndex;
				callback(ret);
			});
		}catch(e){
			console.log(e);
			callback({});
		}
	}

	static encodeRelayState(relayState) {
		try{
			return Base64.encode(JSON.stringify(relayState));
		}catch(e){
			return "{}";
		}
	}
	
	static dncodeRelayState(relayState){
		if(!relayState){
			return {};
		}
		
		try{
			return JSON.parse(Base64.decode(relayState));
		}catch(e){
			return {};
		}
	}
	
	static createLoginRequestUrl(config, params, callback){
		config.sp.create_login_request_url(config.idp, params, function(err, login_url, request_id) {
			if (err != null){
				callback("/error/500");
			}else{
				callback(login_url);
			}
		});
	}
	
	static createLogoutRequestUrl(config, params, callback){	
		config.sp.create_logout_request_url(config.idp, params, function(err, logout_url) {
			if (err != null){
				callback("/error/500");
			}else{
				callback(logout_url);
			}
		});
	}
}

export const defaultsSettings = {
	web: {
		checkPoint: {cookie: "CS"},
		issuer: 'bigc',
		loginUrl: clientConfig.params.samlUrl+"/samlsso",
		logoutUrl: clientConfig.params.samlUrl+"/samlsso",
		endpoint: "https:"+clientConfig.params.wapUrl+"/sso/saml-consume",
		defReferer: '/'
	},
	app: {
		checkPoint: {cookie: "CS"},
		issuer: 'mbigc',
		loginUrl: clientConfig.params.samlUrl+"/samlsso",
		logoutUrl: clientConfig.params.samlUrl+"/samlsso",
		endpoint: "https:"+clientConfig.params.wapUrl+"/sso/saml-consume",
		defReferer: '/'
	}
};
export const webSaml = createSpIdp(defaultsSettings.web);
export const appSaml = createSpIdp(defaultsSettings.app);
export default SamlUtil;