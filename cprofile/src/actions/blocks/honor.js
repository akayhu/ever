import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * [API] 取得專案成就列表
 * @param {*} param pid required
 */
export const REQUEST_FETCH_HONOR_LIST = 'REQUEST_FETCH_HONOR_LIST';
export const RECIEVE_FETCH_HONOR_LIST = 'RECIEVE_FETCH_HONOR_LIST';
export const FAILURE_FETCH_HONOR_LIST = 'FAILURE_FETCH_HONOR_LIST';
export const requestFetchHonorList = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/honors`,
		types: [
			REQUEST_FETCH_HONOR_LIST,
			RECIEVE_FETCH_HONOR_LIST,
			FAILURE_FETCH_HONOR_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 取得單筆專案成就
 * @param {*} param pid required
 */
export const REQUEST_FETCH_HONOR = 'REQUEST_FETCH_HONOR';
export const RECIEVE_FETCH_HONOR = 'RECIEVE_FETCH_HONOR';
export const FAILURE_FETCH_HONOR = 'FAILURE_FETCH_HONOR';
export const requestFetchHonor = (param = { pid: -3, honorId: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/honors/${param.honorId}`,
		types: [REQUEST_FETCH_HONOR, RECIEVE_FETCH_HONOR, FAILURE_FETCH_HONOR],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 新增一筆專案成就
 * @param {*} param
 */
export const REQUEST_CREATE_HONOR = 'REQUEST_CREATE_HONOR';
export const RECIEVE_CREATE_HONOR = 'RECIEVE_CREATE_HONOR';
export const FAILURE_CREATE_HONOR = 'FAILURE_CREATE_HONOR';
export const requestCreateHonor = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/honors`,
		types: [REQUEST_CREATE_HONOR, RECIEVE_CREATE_HONOR, FAILURE_CREATE_HONOR],
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
 * [API] 更新一筆專案成就
 * @param {*} param
 */
export const REQUEST_UPDATE_HONOR = 'REQUEST_UPDATE_HONOR';
export const RECIEVE_UPDATE_HONOR = 'RECIEVE_UPDATE_HONOR';
export const FAILURE_UPDATE_HONOR = 'FAILURE_UPDATE_HONOR';
export const requestUpdateHonor = param => {
	delete param['fileUrlMap'];
	return {
		[RSAA]: {
			endpoint: `${generalConfig.api}/users/${param.pid}/honors/${
				param.honorId
			}`,
			types: [REQUEST_UPDATE_HONOR, RECIEVE_UPDATE_HONOR, FAILURE_UPDATE_HONOR],
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
 * [API] 刪除一筆專案成就
 * @param {*} param
 */
export const REQUEST_DELETE_HONOR = 'REQUEST_DELETE_HONOR';
export const RECIEVE_DELETE_HONOR = 'RECIEVE_DELETE_HONOR';
export const FAILURE_DELETE_HONOR = 'FAILURE_DELETE_HONOR';
export const requestDeleteHonor = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/honors/${param.honorId}`,
		types: [REQUEST_DELETE_HONOR, RECIEVE_DELETE_HONOR, FAILURE_DELETE_HONOR],
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
