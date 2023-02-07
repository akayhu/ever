import { RSAA } from 'redux-api-middleware';
import uuid from 'uuid/v4';
import generalConfig from 'config/general';

// [saga] 取得收藏清單
export const FETCH_MY_COLLECTION = 'FETCH_MY_COLLECTION';
export const fetchMyCollectionProcess = extendedState => ({
	type: FETCH_MY_COLLECTION,
	extendedState,
});

// [saga] 新增收藏
export const ADD_COLLECTION = 'ADD_COLLECTION';
export const addCollection = (
	targetPid = -3,
	processId = uuid(),
	callback
) => ({
	type: ADD_COLLECTION,
	targetPid,
	processId,
	callback,
});

// [saga] 取消收藏
export const CANCEL_COLLECTION = 'CANCEL_COLLECTION';
export const cancelCollection = (
	targetPid = -3,
	processId = uuid(),
	callback
) => ({
	type: CANCEL_COLLECTION,
	targetPid,
	processId,
	callback,
});

// [ui] 更新 collection 資料到 redux
export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const updateCollection = payload => ({
	type: UPDATE_COLLECTION,
	payload,
});

// [RSAA] 取得收藏清單
export const REQUEST_COLLECTION_LIST = 'REQUEST_COLLECTION_LIST';
export const RECIEVE_COLLECTION_LIST = 'RECIEVE_COLLECTION_LIST';
export const FAILURE_COLLECTION_LIST = 'FAILURE_COLLECTION_LIST';
export const requestCollectionList = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/collections`,
		types: [
			REQUEST_COLLECTION_LIST,
			RECIEVE_COLLECTION_LIST,
			FAILURE_COLLECTION_LIST,
		],
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

// [RSAA] 新增收藏
export const REQUEST_ADD_COLLECTION = 'REQUEST_ADD_COLLECTION';
export const RECIEVE_ADD_COLLECTION = 'RECIEVE_ADD_COLLECTION';
export const FAILURE_ADD_COLLECTION = 'FAILURE_ADD_COLLECTION';
export const requestAddCollection = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/collections`,
		types: [
			REQUEST_ADD_COLLECTION,
			RECIEVE_ADD_COLLECTION,
			FAILURE_ADD_COLLECTION,
		],
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
	},
});

// [RSAA] 取消收藏
export const REQUEST_CANCEL_COLLECTION = 'REQUEST_CANCEL_COLLECTION';
export const RECIEVE_CANCEL_COLLECTION = 'RECIEVE_CANCEL_COLLECTION';
export const FAILURE_CANCEL_COLLECTION = 'FAILURE_CANCEL_COLLECTION';
export const requestCancelCollection = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/collections/${
			param.targetPid
		}`,
		types: [
			REQUEST_CANCEL_COLLECTION,
			RECIEVE_CANCEL_COLLECTION,
			FAILURE_CANCEL_COLLECTION,
		],
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		processMethod: 'takeLatest',
	},
});
