import { RSAA } from 'redux-api-middleware';
import { updateCard } from 'actions/ui/card';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * [API] 取得客製化區塊列表
 * @param {*} param pid required
 */
export const REQUEST_FETCH_CUSTOM_LIST = 'REQUEST_FETCH_CUSTOM_LIST';
export const RECIEVE_FETCH_CUSTOM_LIST = 'RECIEVE_FETCH_CUSTOM_LIST';
export const FAILURE_FETCH_CUSTOM_LIST = 'FAILURE_FETCH_CUSTOM_LIST';
export const requestFetchCustomList = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/customs`,
		types: [
			REQUEST_FETCH_CUSTOM_LIST,
			RECIEVE_FETCH_CUSTOM_LIST,
			FAILURE_FETCH_CUSTOM_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		next: (response, json) => {
			const list = json;
			return list.map(data => updateCard(data.customId, data));
		},
	},
});

/**
 * [API] 取得一筆客製化區塊內容
 * @param {*} param pid required
 */
export const REQUEST_FETCH_CUSTOM = 'REQUEST_FETCH_CUSTOM';
export const RECIEVE_FETCH_CUSTOM = 'RECIEVE_FETCH_CUSTOM';
export const FAILURE_FETCH_CUSTOM = 'FAILURE_FETCH_CUSTOM';
export const requestFetchCustom = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/customs/${
			param.customId
		}`,
		types: [REQUEST_FETCH_CUSTOM, RECIEVE_FETCH_CUSTOM, FAILURE_FETCH_CUSTOM],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		next: (response, json) => {
			const list = json;
			return list.map(data => updateCard(data.customId, data));
		},
	},
});

/**
 * [API] 新增一筆客製化區塊
 * @param {*} param
 */
export const REQUEST_CREATE_CUSTOM = 'REQUEST_CREATE_CUSTOM';
export const RECIEVE_CREATE_CUSTOM = 'RECIEVE_CREATE_CUSTOM';
export const FAILURE_CREATE_CUSTOM = 'FAILURE_CREATE_CUSTOM';
export const requestCreateCustom = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/customs`,
		types: [
			REQUEST_CREATE_CUSTOM,
			RECIEVE_CREATE_CUSTOM,
			FAILURE_CREATE_CUSTOM,
		],
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
		error: (response, json) =>
			response.status === 401 || response.status === 403 ? logout() : [],
	},
});

/**
 * [API] 更新一筆客製化區塊
 * @param {*} param
 */
export const REQUEST_UPDATE_CUSTOM = 'REQUEST_UPDATE_CUSTOM';
export const RECIEVE_UPDATE_CUSTOM = 'RECIEVE_UPDATE_CUSTOM';
export const FAILURE_UPDATE_CUSTOM = 'FAILURE_UPDATE_CUSTOM';
export const requestUpdateCustom = param => {
	delete param['fileUrlMap'];
	delete param['snapshotFileUrlMap'];
	return {
		[RSAA]: {
			endpoint: `${generalConfig.api}/users/${param.pid}/customs/${
				param.customId
			}`,
			types: [
				REQUEST_UPDATE_CUSTOM,
				RECIEVE_UPDATE_CUSTOM,
				FAILURE_UPDATE_CUSTOM,
			],
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(param),
			credentials: 'include',
			processMethod: 'takeLatest',
			error: (response, json) =>
				response.status === 401 || response.status === 403 ? logout() : [],
		},
	};
};

/**
 * [API] 刪除一筆客製化區塊
 * @param {*} param
 */
export const REQUEST_DELETE_CUSTOM = 'REQUEST_DELETE_CUSTOM';
export const RECIEVE_DELETE_CUSTOM = 'RECIEVE_DELETE_CUSTOM';
export const FAILURE_DELETE_CUSTOM = 'FAILURE_DELETE_CUSTOM';
export const requestDeleteCustom = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/customs/${
			param.customId
		}`,
		types: [
			REQUEST_DELETE_CUSTOM,
			RECIEVE_DELETE_CUSTOM,
			FAILURE_DELETE_CUSTOM,
		],
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
		error: (response, json) =>
			response.status === 401 || response.status === 403 ? logout() : [],
	},
});
