// privacyService
export const QUERY_PRIVACY_BYPIDS = 'QUERY_PRIVACY_BYPIDS';
export const QUERY_PRIVACY_INFO = 'QUERY_PRIVACY_INFO';
export const QUERY_SINGLE_PRIVACY = 'QUERY_SINGLE_PRIVACY';
export const UPDATE_PRIVACY = 'UPDATE_PRIVACY';
export const UPDATE_SINGLE_PRIVACY = 'UPDATE_SINGLE_PRIVACY';

// memberShipService
export const SETMEMBERIDENTITY = 'SETMEMBERIDENTITY';
export const GETMEMBERIDENTITYLIST = 'GETMEMBERIDENTITYLIST';
export const ISALLOWREADPROFILE = 'ISALLOWREADPROFILE';


// 取得 多筆 pid 全部 隱私權限設定
export function queryPrivacyByPids(params) {
	return {
		CALL_API: {
			type: QUERY_PRIVACY_BYPIDS,
			method: 'get',
			target: '/account/privacy/queryPrivacyByPids',
			params
		}
	};
}

// 取得 單筆 pid 全部 隱私權限設定
export function queryPrivacyInfo(params) {
	return {
		CALL_API: {
			type: QUERY_PRIVACY_INFO,
			method: 'get',
			target: '/account/privacy/queryPrivacyInfo',
			params
		}
	};
}

// 取得 單筆 pid 單筆 隱私權限設定
export function querySinglePrivacy(params) {
	return {
		CALL_API: {
			type: QUERY_SINGLE_PRIVACY,
			method: 'get',
			target: '/account/privacy/querySinglePrivacy',
			params
		}
	};
}

// 更新 全部 隱私權限設定
export function updatePrivacy(params) {
	return {
		CALL_API: {
			type: UPDATE_PRIVACY,
			method: 'post',
			target: '/account/privacy/updatePrivacy',
			params
		}
	};
}

// 更新 單筆 權限隱私設定
export function updateSinglePrivacy(params) {
	return {
		CALL_API: {
			type: UPDATE_SINGLE_PRIVACY,
			method: 'post',
			target: '/account/privacy/updateSinglePrivacy',
			params
		}
	};
}

// wtf memberShipService 為什麼會在這

export function setMemberIdentity(params) {
	return {
		CALL_API: {
			type: SETMEMBERIDENTITY,
			method: 'post',
			target: '/account/privacy/setMemberIdentity',
			params
		}
	};
}

export function getMemberIdentityList(params) {
	return {
		CALL_API: {
			type: GETMEMBERIDENTITYLIST,
			method: 'get',
			target: '/account/privacy/getMemberIdentityList',
			params
		}
	};
}

export function isAllowReadProfile(params) {
	return {
		CALL_API: {
			type: ISALLOWREADPROFILE,
			method: 'post',
			target: '/account/privacy/isAllowReadProfile',
			params
		}
	};
}
