export const LOAD_USER_CONFIG_BY_TYPE = 'LOAD_USER_CONFIG_BY_TYPE';
export function loadUserConfigByType(params) {
	return {
		'CALL_API': {
			type: LOAD_USER_CONFIG_BY_TYPE,
			method: 'get',
			target: '/personal/config/queryPersonalConfigByPidAndType',
			params: params
		}
	};
}

export const LOADED_USERINFO = 'LOADED_USERINFO';
export function loadedUserInfo (params) {
	return {
		'CALL_API': {
			type: LOADED_USERINFO,
			method: 'get',
			target: '/profile/profilePersonal/getUserInfo',
			params: params
		}
	};
}