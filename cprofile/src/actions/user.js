import { RSAA } from 'redux-api-middleware';
import pathToRegexp from 'path-to-regexp';
import generalConfig from 'config/general';

export const REQUEST_USER = 'REQUEST_USER';
export const RECIEVE_USER = 'RECIEVE_USER';
export const FAILURE_USER = 'FAILURE_USER';

/**
 * 開始取得使用者帳戶資料流程
 */
export const ACCOUNT_PROCESS_START = 'ACCOUNT_PROCESS_START';
export const accountProcessStart = () => ({
	type: ACCOUNT_PROCESS_START,
});

/**
 * 帳戶流程成功
 */
export const ACCOUNT_PROCESS_END = 'ACCOUNT_PROCESS_END';
export const accountProcessEnd = () => ({
	type: ACCOUNT_PROCESS_END,
});

/**
 * 帳戶流程失敗
 */
export const ACCOUNT_PROCESS_ERROR = 'ACCOUNT_PROCESS_ERROR';
export const accountProcessError = error => ({
	type: ACCOUNT_PROCESS_ERROR,
	error,
});

/**
 * 開始啟用服務流程
 */
export const INITIAL_PROFILE_PROCESS_START = 'INITIAL_PROFILE_PROCESS_START';
export const initialProfileProcessStart = () => ({
	type: INITIAL_PROFILE_PROCESS_START,
});

/**
 * 啟用服務流程成功
 */
export const INITIAL_PROFILE_PROCESS_END = 'INITIAL_PROFILE_PROCESS_END';
export const initialProfileProcessEnd = () => ({
	type: INITIAL_PROFILE_PROCESS_END,
});

/**
 * 啟用服務流程失敗
 */
export const INITIAL_PROFILE_PROCESS_ERROR = 'INITIAL_PROFILE_PROCESS_ERROR';
export const initialProfileProcessError = error => ({
	type: INITIAL_PROFILE_PROCESS_ERROR,
	error,
});

/**
 * 使用者登入，轉導 AC login 路徑
 */
export const USER_LOGIN = 'USER_LOGIN';
export const login = (returnUrl = '/') => ({
	type: USER_LOGIN,
	returnUrl,
});

/**
 * 使用者登出，轉導 AC logout 路徑
 */
export const USER_LOGOUT = 'USER_LOGOUT';
export const logout = (returnUrl = '/') => ({
	type: USER_LOGOUT,
	returnUrl,
});

/**
 * 取得使用者是否已登入 (後端判斷瀏覽器 cookie)
 * 自動連登 & 自動轉導登入判斷
 */
export const REQUEST_LOGIN_STATUS = 'REQUEST_LOGIN_STATUS';
export const RECIEVE_LOGIN_STATUS = 'RECIEVE_LOGIN_STATUS';
export const FAILURE_LOGIN_STATUS = 'FAILURE_LOGIN_STATUS';
export const requestLoginStatus = () => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/auth/status`,
		types: [REQUEST_LOGIN_STATUS, RECIEVE_LOGIN_STATUS, FAILURE_LOGIN_STATUS],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		next: (response, json) => {
			// 未登入時，會啟動自動導登入的 route
			const autoRedirectLoginPaths = [
				'/editor',
				'/editor/commonMode',
				'/preview/:previewName',
				'/profile/:pid/preview',
				'/search',
				'/collection',
			];

			if (json.type === 1) {
				// 遇到登入不完全、連登 (type = 1) ， 直接導 login 完成程序
				return login(window.location.pathname);
			}

			if (json.type === 0) {
				// 未登入時，自動轉導登入的路徑
				for (let path of autoRedirectLoginPaths) {
					// null or array
					if (pathToRegexp(path).exec(window.location.pathname)) {
						return login(window.location.pathname);
					}
				}
			}
		},
	},
});

/**
 * 取得使用者 AC 名稱
 */
export const REQUEST_USERNAME = 'REQUEST_USERNAME';
export const RECIEVE_USERNAME = 'RECIEVE_USERNAME';
export const FAILURE_USERNAME = 'FAILURE_USERNAME';
export const requestUserName = () => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/member`,
		types: [REQUEST_USERNAME, RECIEVE_USERNAME, FAILURE_USERNAME],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		next: (response, json) => updateUserData(json),
	},
});

/**
 * [API] 初始化建立 profile
 * @param {*} param pid required
 */
export const REQUEST_INITIAL_PROFILE = 'REQUEST_INITIAL_PROFILE';
export const RECIEVE_INITIAL_PROFILE = 'RECIEVE_INITIAL_PROFILE';
export const FAILURE_INITIAL_PROFILE = 'FAILURE_INITIAL_PROFILE';
export const requestInitialProfile = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/initial`,
		types: [
			REQUEST_INITIAL_PROFILE,
			RECIEVE_INITIAL_PROFILE,
			FAILURE_INITIAL_PROFILE,
		],
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		// bailout: (store) => (!param.pid || param.pid === -3),
		error: (response, json) =>
			response.status === 401 || response.status === 403 ? logout() : [],
	},
});

// 更新使用者 basic 資訊
export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const updateUserData = payload => ({
	type: UPDATE_USER_DATA,
	payload,
});
