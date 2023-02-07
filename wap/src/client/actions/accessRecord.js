export const QUERY_VIEWER = 'QUERY_VIEWER';
export function queryViewer( params ) {
	return {
		'CALL_API': {
			type: QUERY_VIEWER,
			method: 'get',
			target: '/profile/accessRecord/queryViewer',
			params: params
		}
	};
}

export const QUERY_VIEWER_FROM_PRO = 'QUERY_VIEWER_FROM_PRO';
export function queryViewerFromPro( params ) {
	return {
		'CALL_API': {
			type: QUERY_VIEWER_FROM_PRO,
			method: 'get',
			target: '/profile/accessRecord/queryViewerFromPro',
			params: params
		}
	};
}