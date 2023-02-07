export const REQUST_ACTIVITY_DATA = 'REQUST_ACTIVITY_DATA';
export const requestData = (category, params) => ({
	type: REQUST_ACTIVITY_DATA,
	category,
	params
});

export const RECEIVE_ACTIVITY_LIST_DATA = 'RECEIVE_ACTIVITY_LIST_DATA';
export const receiveListData = (category, response, params) => ({
	type: RECEIVE_ACTIVITY_LIST_DATA,
	category,
	response,
	params
});

export const RECEIVE_ACTIVITY_DATA = 'RECEIVE_ACTIVITY_DATA';
export const receiveData = (category, response, params, query) => ({
	type: RECEIVE_ACTIVITY_DATA,
	category,
	response,
	params: {
		...params,
		...query
	}
});

export const RECEIVE_ACTIVITY_COUNT = 'RECEIVE_ACTIVITY_COUNT';
export const receiveCount= (category, response, params) => ({
	type: RECEIVE_ACTIVITY_COUNT,
	category,
	response,
	params
});

export const RECEIVE_ACTIVITY_FAIL = 'RECEIVE_ACTIVITY_FAIL';
export const receiveFail = (category, errorMsg) => ({
	type: RECEIVE_ACTIVITY_FAIL,
	category,
	errorMsg
});

// export const REACH_ACTIVITY_END = 'REACH_ACTIVITY_END';
// const reachEnd = (category) => ({
// 	type: REACH_ACTIVITY_END,
// 	category
// });
