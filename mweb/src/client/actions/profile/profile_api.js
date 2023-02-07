// constants
export const LOADED_PROFILE = 'LOADED_PROFILE';
export const GET_CONNECTION_STATUS = 'GET_CONNECTION_STATUS';
export const QUERY_VIEWER = 'QUERY_VIEWER';
export const QUERY_VIEWER_FROM_PRO = 'QUERY_VIEWER_FROM_PRO';
export const QUERY_VIEWER_COUNT = 'QUERY_VIEWER_COUNT';
export const LOADED_CHRONICLE = 'LOADED_CHRONICLE';
export const GET_GALLERY_LIST = 'GET_GALLERY_LIST';
export const QUERY_APPRAISE_LIST_OF_OWNER = 'QUERY_APPRAISE_LIST_OF_OWNER';
export const QUERY_APPRAISE_LIST = 'QUERY_APPRAISE_LIST';
export const GET_ENDORSE_LIST = 'GET_ENDORSE_LIST';
export const QUERY_COLLEAGE_LIST = 'QUERY_COLLEAGE_LIST';
export const CHECK_IDENTITY = 'CHECK_IDENTITY';
export const VIEW_PROFILE = 'VIEW_PROFILE';

// action creators
export const loadProfile = params => ({
	CALL_API: {
		type: LOADED_PROFILE,
		method: 'get',
		target: '/profile/'+params.pid,
		params: {},
	},
});

export function checkIdentity(userPid, paramsPid, status) {
	return {
		type: CHECK_IDENTITY,
		userPid: userPid,
		paramsPid: paramsPid,
		status: status
	};
}

export function queryViewer(params) {
	return {
		CALL_API: {
			type: QUERY_VIEWER,
			method: 'get',
			target: '/profile/accessRecord/queryViewer',
			params,
		},
	};
}

export function queryViewerFromPro(params) {
	return {
		CALL_API: {
			type: QUERY_VIEWER_FROM_PRO,
			method: 'get',
			target: '/profile/accessRecord/queryViewerFromPro',
			params,
		},
	};
}

export function queryViewerCount(params) {
	return {
		CALL_API: {
			type: QUERY_VIEWER_COUNT,
			method: 'get',
			target: '/profile/accessRecord/queryViewerCount',
			params,
		},
	};
}

export const loadChronicle = params => ({
	CALL_API: {
		type: LOADED_CHRONICLE,
		method: 'get',
		target: '/profile/profileChronology/getAllEventList',
		params,
	},
});

export const getGalleryList = params => ({
	CALL_API: {
		type: GET_GALLERY_LIST,
		method: 'get',
		target: '/profile/profileGallery/getGalleryList',
		params,
	},
});

export const queryAppraiseListOfOwner = params => ({
	CALL_API: {
		type: QUERY_APPRAISE_LIST_OF_OWNER,
		method: 'get',
		target: '/profile/appraise/queryAppraiseListOfOwner',
		params,
	},
});

export const queryAppraiseList = params => ({
	CALL_API: {
		type: QUERY_APPRAISE_LIST,
		method: 'get',
		target: '/profile/appraise/queryAppraiseList',
		params,
	},
});

export const getEndorseList = params => ({
	CALL_API: {
		type: GET_ENDORSE_LIST,
		method: 'get',
		target: '/profile/profileEndorse/getEndorseList',
		params,
	},
});

export const queryColleagueList = params => ({
	CALL_API: {
		type: QUERY_COLLEAGE_LIST,
		method: 'get',
		target: '/profile/colleague/queryColleagueList',
		params,
	},
});

// 為connection的API，但在mobile中沒有人脈相關頁面，因此暫放於此
export const getConnectionStatus = params => ({
	CALL_API: {
		type: GET_CONNECTION_STATUS,
		method: 'get',
		target: '/connection/getConnectionStatus',
		params,
	},
});

export function viewProfile(params) {
	return {
		'CALL_API': {
			type: VIEW_PROFILE,
			method: 'get',
			target: '/profile/accessRecord/viewProfile',
			params: params
		}
	};
}

