export const LOADING_NOTIFICATION = 'LOADING_NOTIFICATION';
export const GET_NOTIFICATION_LIST = 'GET_NOTIFICATION_LIST';

/**
 * @param {*} type (init) 初始載入列表 / more 讀取更多
 */
export const getNotificationList = (type = 'init') => (dispatch, getState) => {
	const state = getState();
	const isLoading = state.notification.isLoading;
	const hasNext = state.notification.hasNext;
	const dataList = state.notification.dataList;
	const cursor = state.notification.cursor || null;
	// loading 中、到底了不重複送 action
	if (isLoading) return;
	if (!isLoading && !hasNext && dataList.length > 0) return;

	dispatch({
		type: LOADING_NOTIFICATION,
	});

	dispatch({
		CALL_API: {
			type: GET_NOTIFICATION_LIST,
			method: 'get',
			target: '/pusher/getNotiByPid',
			params: {
				limit: (type === 'more') ? 10 : 20,
				cursor,
			},
		},
	});
};
