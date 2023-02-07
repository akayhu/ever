export const GET_COLLECT_LIST = 'GET_COLLECT_LIST';
export const getCollectList = params => ({
	CALL_API: {
		type: GET_COLLECT_LIST,
		method: 'get',
		target: '/activity/getCollectList',
		params,
	},
});
