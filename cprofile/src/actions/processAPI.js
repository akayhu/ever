/**
 * 創建一個 requestType 的 action stream 訂閱
 */
export const CREATE_API_REQUEST_EPIC =
	'@@process-api-middleware/CREATE_API_REQUEST_EPIC';
export const createAPIRequestEpic = requestAction => ({
	type: CREATE_API_REQUEST_EPIC,
	payload: requestAction,
});

/**
 * 由於已存在該 requestType 的 action stream 訂閱，忽略不做任何動作
 */
export const BYPASS_AND_PROCESS_BY_API_REQUEST_EPIC =
	'@@process-api-middleware/BYPASS_AND_PROCESS_BY_API_REQUEST_EPIC';
export const bypassAndProcessByEpic = requestAction => ({
	type: BYPASS_AND_PROCESS_BY_API_REQUEST_EPIC,
	payload: requestAction,
});

/**
 * 移除一個 requestType 的 action stream 訂閱
 */
export const DELETE_API_REQUEST_EPIC =
	'@@process-api-middleware/DELETE_API_REQUEST_EPIC';
export const deleteAPIRequestEpic = requestAction => ({
	type: DELETE_API_REQUEST_EPIC,
	payload: requestAction,
});
