export const CREATE_FROM_PROMOTION = 'CREATE_FROM_PROMOTION'
export function createFromPromotion(target) {
	return {
		type: CREATE_FROM_PROMOTION,
		target: target
	};
}

export const UPDATE_USER_CONFIG = 'UPDATE_USER_CONFIG';
export function updatePersonalConfig(params) {
	return {
		'CALL_API': {
			type: UPDATE_USER_CONFIG,
			method: 'post',
			target: '/personal/config/updatePersonalConfig',
			params
		}
	};
}

export const LOAD_USER_CONFIG_BY_TYPE = 'LOAD_USER_CONFIG_BY_TYPE';
export function loadUserConfigByType(params) {
	return {
		'CALL_API': {
			type: LOAD_USER_CONFIG_BY_TYPE,
			method: 'get',
			target: '/personal/config/queryPersonalConfigByPidAndType',
			params
		}
	};
}