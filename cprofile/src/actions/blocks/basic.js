import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * [API] 取得 basic 基本資料
 * @param {*} param pid required
 */
export const REQUEST_FETCH_PROFILE_BASIC = 'REQUEST_FETCH_PROFILE_BASIC';
export const RECIEVE_FETCH_PROFILE_BASIC = 'RECIEVE_FETCH_PROFILE_BASIC';
export const FAILURE_FETCH_PROFILE_BASIC = 'FAILURE_FETCH_PROFILE_BASIC';
export const requestFetchProfileBasic = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/basic`,
		types: [
			REQUEST_FETCH_PROFILE_BASIC,
			RECIEVE_FETCH_PROFILE_BASIC,
			FAILURE_FETCH_PROFILE_BASIC,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 修改 basic 基本資料
 * @param {*} param
 */
export const REQUEST_UPDATE_PROFILE_BASIC = 'REQUEST_UPDATE_PROFILE_BASIC';
export const RECIEVE_UPDATE_PROFILE_BASIC = 'RECIEVE_UPDATE_PROFILE_BASIC';
export const FAILURE_UPDATE_PROFILE_BASIC = 'FAILURE_UPDATE_PROFILE_BASIC';
export const requestUpdateProfileBasic = param => {
	delete param['avatarFileUrls'];
	delete param['coverFileUrls'];
	return {
		[RSAA]: {
			endpoint: `${generalConfig.api}/users/${param.pid}/basic`,
			types: [
				REQUEST_UPDATE_PROFILE_BASIC,
				RECIEVE_UPDATE_PROFILE_BASIC,
				FAILURE_UPDATE_PROFILE_BASIC,
			],
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(param),
			credentials: 'include',
			error: (response, json) =>
				response.status === 401 || response.status === 403 ? logout() : [],
		},
	};
};
