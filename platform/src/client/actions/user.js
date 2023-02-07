"use strict";

//取得使用者資訊
export const LOADED_USER = 'LOADED_USER';
export function loadUser(params) {
	return {
		'CALL_API': {
			type: LOADED_USER,
			method: 'get',
			target: '/user/'+params.pid
		}
	};
}

export const GET_AC_USERNAME = 'GET_AC_USERNAME';
export function getACUserName(params) {
	return {
		'CALL_API': {
			type: GET_AC_USERNAME,
			method: 'get',
			target: '/account/name',
			params: params
		}
	};
}

export const GET_MEMBERSHIP_INFO = 'GET_MEMBERSHIP_INFO';
export function getMembershipInfo(params) {
	return {
		'CALL_API': {
			type: GET_MEMBERSHIP_INFO,
			method: 'get',
			target: '/account/getMembershipInfo',
			params: params
		}
	};
}