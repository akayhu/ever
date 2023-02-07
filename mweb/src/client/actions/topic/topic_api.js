// constants
export const GET_SUBSCRIBE_LIST = 'GET_SUBSCRIBE_LIST';
export const GET_WORKSPACE_LIST_HOT = 'GET_WORKSPACE_LIST_HOT';

// action creators
export const getSubscribeList = params => ({
	CALL_API: {
		type: GET_SUBSCRIBE_LIST,
		method: 'get',
		target: '/topic/getSubscribeList',
		params,
	},
});


export const getWorkspaceListHot = params => ({
	CALL_API: {
		type: GET_WORKSPACE_LIST_HOT,
		method: 'get',
		target: '/topic/getWorkspaceListHot',
		params,
	},
});
