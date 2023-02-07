import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * 取得專長技能列表
 * @param {object} param pid required
 */
export const REQUEST_FETCH_TALENT_LIST = 'REQUEST_FETCH_TALENT_LIST';
export const RECIEVE_FETCH_TALENT_LIST = 'RECIEVE_FETCH_TALENT_LIST';
export const FAILURE_FETCH_TALENT_LIST = 'FAILURE_FETCH_TALENT_LIST';
export const requestFetchTalentList = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/talents`,
		types: [
			REQUEST_FETCH_TALENT_LIST,
			RECIEVE_FETCH_TALENT_LIST,
			FAILURE_FETCH_TALENT_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * 寫入專長技能資料
 */
export const REQUEST_CREATE_TALENT = 'REQUEST_CREATE_TALENT';
export const RECIEVE_CREATE_TALENT = 'RECIEVE_CREATE_TALENT';
export const FAILURE_CREATE_TALENT = 'FAILURE_CREATE_TALENT';
export const requestCreateTalent = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/talents`,
		types: [
			REQUEST_CREATE_TALENT,
			RECIEVE_CREATE_TALENT,
			FAILURE_CREATE_TALENT,
		],
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
		error: (response, json) =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});

/**
 * 修改一筆專長技能
 */
export const REQUEST_UPDATE_TALENT = 'REQUEST_UPDATE_TALENT';
export const RECIEVE_UPDATE_TALENT = 'RECIEVE_UPDATE_TALENT';
export const FAILURE_UPDATE_TALENT = 'FAILURE_UPDATE_TALENT';
export const requestUpdateTalent = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/talents/${param.tagId}`,
		types: [
			REQUEST_UPDATE_TALENT,
			RECIEVE_UPDATE_TALENT,
			FAILURE_UPDATE_TALENT,
		],
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
		error: (response, json) =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});

/**
 * 刪除一筆專長技能
 */
export const REQUEST_DELETE_TALENT = 'REQUEST_DELETE_TALENT';
export const RECIEVE_DELETE_TALENT = 'RECIEVE_DELETE_TALENT';
export const FAILURE_DELETE_TALENT = 'FAILURE_DELETE_TALENT';
export const requestDeleteTalent = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/talents/${param.tagId}`,
		types: [
			REQUEST_DELETE_TALENT,
			RECIEVE_DELETE_TALENT,
			FAILURE_DELETE_TALENT,
		],
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
		error: (response, json) =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});
