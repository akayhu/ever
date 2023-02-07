import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * [API] 取得學歷列表
 * @param {*} param pid required
 */
export const REQUEST_FETCH_EDUCATION_LIST = 'REQUEST_FETCH_EDUCATION_LIST';
export const RECIEVE_FETCH_EDUCATION_LIST = 'RECIEVE_FETCH_EDUCATION_LIST';
export const FAILURE_FETCH_EDUCATION_LIST = 'FAILURE_FETCH_EDUCATION_LIST';
export const requestFetchEducationList = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/educations`,
		types: [
			REQUEST_FETCH_EDUCATION_LIST,
			RECIEVE_FETCH_EDUCATION_LIST,
			FAILURE_FETCH_EDUCATION_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 新增一筆學歷
 * @param {*} param
 */
export const REQUEST_CREATE_EDUCATION = 'REQUEST_CREATE_EDUCATION';
export const RECIEVE_CREATE_EDUCATION = 'RECIEVE_CREATE_EDUCATION';
export const FAILURE_CREATE_EDUCATION = 'FAILURE_CREATE_EDUCATION';
export const requestCreateEducation = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/educations`,
		types: [
			REQUEST_CREATE_EDUCATION,
			RECIEVE_CREATE_EDUCATION,
			FAILURE_CREATE_EDUCATION,
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
 * [API] 修改一筆學歷
 * @param {*} param
 */
export const REQUEST_UPDATE_EDUCATION = 'REQUEST_UPDATE_EDUCATION';
export const RECIEVE_UPDATE_EDUCATION = 'RECIEVE_UPDATE_EDUCATION';
export const FAILURE_UPDATE_EDUCATION = 'FAILURE_UPDATE_EDUCATION';
export const requestUpdateEducation = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/educations/${
			param.eduId
		}`,
		types: [
			REQUEST_UPDATE_EDUCATION,
			RECIEVE_UPDATE_EDUCATION,
			FAILURE_UPDATE_EDUCATION,
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
 * [API] 刪除一筆學歷
 * @param {*} param
 */
export const REQUEST_DELETE_EDUCATION = 'REQUEST_DELETE_EDUCATION';
export const RECIEVE_DELETE_EDUCATION = 'RECIEVE_DELETE_EDUCATION';
export const FAILURE_DELETE_EDUCATION = 'FAILURE_DELETE_EDUCATION';
export const requestDeleteEducation = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/educations/${
			param.eduId
		}`,
		types: [
			REQUEST_DELETE_EDUCATION,
			RECIEVE_DELETE_EDUCATION,
			FAILURE_DELETE_EDUCATION,
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
