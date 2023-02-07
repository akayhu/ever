// constatnts
export const QUERY_VIEWER = 'QUERY_VIEWER';
export const QUERY_VIEWER_FROM_PRO = 'QUERY_VIEWER_FROM_PRO';
export const QUERY_VIEWER_COUNT = 'QUERY_VIEWER_COUNT';

// action creators
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