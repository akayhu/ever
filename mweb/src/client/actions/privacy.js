export const QUERY_PRIVACY_INFO = 'QUERY_PRIVACY_INFO';
export const queryPrivacyInfo = params => ({
	CALL_API: {
		type: QUERY_PRIVACY_INFO,
		method: 'get',
		target: '/account/privacy/queryPrivacyInfo',
		params,
	},
});

export const ISALLOWREADPROFILE = 'ISALLOWREADPROFILE';
export function isAllowReadProfile(params) {
	return {
		'CALL_API': {
			type: ISALLOWREADPROFILE,
			method: 'post',
			target: '/account/privacy/isAllowReadProfile',
			params: params
		}
	}
}
