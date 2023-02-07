import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * [API] 取得經歷列表
 * @param {*} param pid required
 */
export const REQUEST_FETCH_EXPERIENCE_LIST = 'REQUEST_FETCH_EXPERIENCE_LIST';
export const RECIEVE_FETCH_EXPERIENCE_LIST = 'RECIEVE_FETCH_EXPERIENCE_LIST';
export const FAILURE_FETCH_EXPERIENCE_LIST = 'FAILURE_FETCH_EXPERIENCE_LIST';
export const requestFetchExperienceList = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/experiences`,
		types: [
			REQUEST_FETCH_EXPERIENCE_LIST,
			RECIEVE_FETCH_EXPERIENCE_LIST,
			FAILURE_FETCH_EXPERIENCE_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 新增一筆經歷
 * @param {*} param
 */
export const REQUEST_CREATE_EXPERIENCE = 'REQUEST_CREATE_EXPERIENCE';
export const RECIEVE_CREATE_EXPERIENCE = 'RECIEVE_CREATE_EXPERIENCE';
export const FAILURE_CREATE_EXPERIENCE = 'FAILURE_CREATE_EXPERIENCE';
export const requestCreateExperience = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/experiences`,
		types: [
			REQUEST_CREATE_EXPERIENCE,
			RECIEVE_CREATE_EXPERIENCE,
			FAILURE_CREATE_EXPERIENCE,
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
 * [API] 修改一筆經歷
 * @param {*} param
 */
export const REQUEST_UPDATE_EXPERIENCE = 'REQUEST_UPDATE_EXPERIENCE';
export const RECIEVE_UPDATE_EXPERIENCE = 'RECIEVE_UPDATE_EXPERIENCE';
export const FAILURE_UPDATE_EXPERIENCE = 'FAILURE_UPDATE_EXPERIENCE';
export const requestUpdateExperience = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/experiences/${
			param.expId
		}`,
		types: [
			REQUEST_UPDATE_EXPERIENCE,
			RECIEVE_UPDATE_EXPERIENCE,
			FAILURE_UPDATE_EXPERIENCE,
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
});

/**
 * [API] 刪除一筆經歷
 * @param {*} param
 */
export const REQUEST_DELETE_EXPERIENCE = 'REQUEST_DELETE_EXPERIENCE';
export const RECIEVE_DELETE_EXPERIENCE = 'RECIEVE_DELETE_EXPERIENCE';
export const FAILURE_DELETE_EXPERIENCE = 'FAILURE_DELETE_EXPERIENCE';
export const requestDeleteExperience = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/experiences/${
			param.expId
		}`,
		types: [
			REQUEST_DELETE_EXPERIENCE,
			RECIEVE_DELETE_EXPERIENCE,
			FAILURE_DELETE_EXPERIENCE,
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
