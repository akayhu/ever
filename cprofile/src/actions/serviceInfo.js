import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';

export const CHANGE_SERVICE_INFO_OPEN = 'CHANGE_SERVICE_INFO_OPEN';

/**
 * [API] 取得 service lightbox 是否出現
 * @param {*} param pid required
 */
export const GET_REQUEST_FETCH_SERVICE_LIGHTBOX =
	'GET_REQUEST_FETCH_SERVICE_LIGHTBOX';
export const GET_RECIEVE_FETCH_SERVICE_LIGHTBOX =
	'GET_RECIEVE_FETCH_SERVICE_LIGHTBOX';
export const GET_FAILURE_FETCH_SERVICE_LIGHTBOX =
	'GET_FAILURE_FETCH_SERVICE_LIGHTBOX';
export const requestFetchServiceLightbox = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/plus-flow/${param.pid}`,
		types: [
			GET_REQUEST_FETCH_SERVICE_LIGHTBOX,
			GET_RECIEVE_FETCH_SERVICE_LIGHTBOX,
			GET_FAILURE_FETCH_SERVICE_LIGHTBOX,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 傳送 log 紀錄
 * @param {*} param pid required
 * @param {*} status required
 */
export const POST_REQUEST_FETCH_SERVICE_LIGHTBOX =
	'POST_REQUEST_FETCH_SERVICE_LIGHTBOX';
export const POST_RECIEVE_FETCH_SERVICE_LIGHTBOX =
	'POST_RECIEVE_FETCH_SERVICE_LIGHTBOX';
export const POST_FAILURE_FETCH_SERVICE_LIGHTBOX =
	'POST_FAILURE_FETCH_SERVICE_LIGHTBOX';
export const postPlusFlow = (param = { pid: -3, status: 0 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/plus-flow/${param.pid}`,
		types: [
			POST_REQUEST_FETCH_SERVICE_LIGHTBOX,
			POST_RECIEVE_FETCH_SERVICE_LIGHTBOX,
			POST_FAILURE_FETCH_SERVICE_LIGHTBOX,
		],
		method: 'POST',
		body: JSON.stringify(param),
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 更新 log 紀錄
 * @param {*} param pid required
 * @param {*} status required
 */
export const PUT_REQUEST_FETCH_SERVICE_LIGHTBOX =
	'PUT_REQUEST_FETCH_SERVICE_LIGHTBOX';
export const PUT_RECIEVE_FETCH_SERVICE_LIGHTBOX =
	'PUT_RECIEVE_FETCH_SERVICE_LIGHTBOX';
export const PUT_FAILURE_FETCH_SERVICE_LIGHTBOX =
	'PUT_FAILURE_FETCH_SERVICE_LIGHTBOX';
export const putPlusFlow = (param = { pid: -3, status: 0 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/plus-flow/${param.pid}`,
		types: [
			PUT_REQUEST_FETCH_SERVICE_LIGHTBOX,
			PUT_RECIEVE_FETCH_SERVICE_LIGHTBOX,
			PUT_FAILURE_FETCH_SERVICE_LIGHTBOX,
		],
		method: 'PUT',
		body: JSON.stringify(param),
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

// 記錄每一次使用者是否看過服務條款的 status 變化
export const CHANGE_STATUS = 'CHANGE_STATUS';
export const changeStatus = status => ({
	type: CHANGE_STATUS,
	payload: status,
});
