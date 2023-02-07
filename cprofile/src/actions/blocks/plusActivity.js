import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * [API] 取得 Plus Activity 資料
 * @param {*} param pid required
 */
export const REQUEST_FETCH_PLUS_ACTIVITY_DATA =
	'REQUEST_FETCH_PLUS_ACTIVITY_DATA';
export const RECIEVE_FETCH_PLUS_ACTIVITY_DATA =
	'RECIEVE_FETCH_PLUS_ACTIVITY_DATA';
export const FAILURE_FETCH_PLUS_ACTIVITY_DATA =
	'FAILURE_FETCH_PLUS_ACTIVITY_DATA';
export const requestFetchPlusActivity = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/plus-activity`,
		types: [
			REQUEST_FETCH_PLUS_ACTIVITY_DATA,
			RECIEVE_FETCH_PLUS_ACTIVITY_DATA,
			FAILURE_FETCH_PLUS_ACTIVITY_DATA,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		error: (response, json) =>
			response.status === 401 || response.status === 403 ? logout() : [],
	},
});

/**
 * [API] 刪除文章
 * @param {*} param pid required
 * @param {*} param aid required
 */
export const REQUEST_FETCH_DELETE_PLUS_ACTIVITY =
	'REQUEST_FETCH_DELETE_PLUS_ACTIVITY';
export const RECIEVE_FETCH_DELETE_PLUS_ACTIVITY =
	'RECIEVE_FETCH_DELETE_PLUS_ACTIVITY';
export const FAILURE_FETCH_DELETE_PLUS_ACTIVITY =
	'FAILURE_FETCH_DELETE_PLUS_ACTIVITY';
export const requestDeletePlusActivity = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/plus-activity/${
			param.aid
		}`,
		types: [
			REQUEST_FETCH_DELETE_PLUS_ACTIVITY,
			RECIEVE_FETCH_DELETE_PLUS_ACTIVITY,
			FAILURE_FETCH_DELETE_PLUS_ACTIVITY,
		],
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		error: (response, json) =>
			response.status === 401 || response.status === 403 ? logout() : [],
	},
});
