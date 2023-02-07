"use strict";

import {actionLogin, actionLogout, actionAfterLogout, actionSignup, FBLogin, actionConsume as SamlConsume} from "../server/controllers/SamlController";
import {actionConsume as FBConsume} from "../server/controllers/FbController";
import {actionCode} from "../server/controllers/ErrorController";
import {actionAjax} from "../server/controllers/IndexController";

const routes = {
	"/sso" : {
		"/saml-login" : {
			method: 'get',
			handler: actionLogin
		},
		"/saml-logout" : [
			{
				method: "get",
				handler: actionLogout
			},
			{
				method: "post",
				handler: actionAfterLogout
			}
		],
		"/saml-consume" : {
			method: 'post',
			handler: SamlConsume
		},
		"/saml-signup": {
			method: 'get',
			handler: actionSignup
		},
		"/fb-login" : {
			method: 'get',
			handler: FBLogin
		},
		"/fb-consume" : {
			method: 'get',
			handler: FBConsume
		}
	}
};

if(process.env.NODE_ENV === 'dev'){
	if(global.isomorphic === true){
		routes["/ajax"] = {
			"/*" : {
				method: 'all',
				handler: actionAjax
			}
		}
	}
	
	routes["/"] = {
		method: 'get',
		layout: 'IndexLayout'
	}
	routes["/error"] = {
		'/:error_code': {
			method: 'all',
			handler: actionCode,
			layout: "ErrorLayout"
		},
		'/:error_code/:error_status': {
			method: 'all',
			handler: actionCode,
			layout: 'ErrorLayout'
		}
	}
}

export default routes;