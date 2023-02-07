import { RSAA } from 'redux-api-middleware';
import { Set } from 'immutable';
import { logout } from './user';
import generalConfig from 'config/general';

// 可用的分享 type
export const validPrivacyTypes = Set(['PUBLIC', 'LINK', 'PRIVATE']);

// 改變 store 儲存的關鍵字並送出搜尋
export const SUBMIT_SEARCH_QUERY = 'SUBMIT_SEARCH_QUERY';
export const submitSearchQuery = (keyword = '') => ({
	type: SUBMIT_SEARCH_QUERY,
	keyword,
});

// 清除上一次搜尋
export const CLEAR_PREVIOUS_SEARCH = 'CLEAR_PREVIOUS_SEARCH';
export const clearPreviousSearch = () => ({
	type: CLEAR_PREVIOUS_SEARCH,
});

// 清除上一次相似的人
export const CLEAR_PREVIOUS_SIMILAR = 'CLEAR_PREVIOUS_SIMILAR';
export const clearPreviousSimilar = () => ({
	type: CLEAR_PREVIOUS_SIMILAR,
});

// 更新分享設定
export const SET_PROFILE_PRIVACY = 'SET_PROFILE_PRIVACY';
export const setProfilePrivacy = (privacy = '', token = null) => ({
	type: SET_PROFILE_PRIVACY,
	privacy,
	token,
});

// [saga] 觸發取得分享設定流程
export const FETCH_PRIVACY_PROCESS = 'FETCH_PRIVACY_PROCESS';
export const fetchPrivacyProcess = () => ({
	type: FETCH_PRIVACY_PROCESS,
});

// [saga] 根據 privacy 切換對應顯示
export const SWITCH_PRIVACY_PROCESS = 'SWITCH_PRIVACY_PROCESS';
export const switchPrivacyProcess = () => ({
	type: SWITCH_PRIVACY_PROCESS,
});

// [saga] 觸發更新分享設定流程
export const SET_PRIVACY_PROCESS = 'SET_PRIVACY_PROCESS';
export const setPrivacyProcess = () => ({
	type: SET_PRIVACY_PROCESS,
});

// 取得搜尋結果
export const REQUEST_SEARCH_PROFILE_LIST = 'REQUEST_SEARCH_PROFILE_LIST';
export const RECIEVE_SEARCH_PROFILE_LIST = 'RECIEVE_SEARCH_PROFILE_LIST';
export const FAILURE_SEARCH_PROFILE_LIST = 'FAILURE_SEARCH_PROFILE_LIST';
export const requestFetchSearchProfileList = (
	param = { offset: 0, limit: 10, query: '' }
) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/search?query=${param.query}&offset=${
			param.offset
		}&limit=${param.limit}`,
		types: [
			REQUEST_SEARCH_PROFILE_LIST,
			RECIEVE_SEARCH_PROFILE_LIST,
			FAILURE_SEARCH_PROFILE_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

// 與自己相似的人 (編輯器資料)
export const REQUEST_MY_SIMILAR_PROFILE_LIST =
	'REQUEST_MY_SIMILAR_PROFILE_LIST';
export const RECIEVE_MY_SIMILAR_PROFILE_LIST =
	'RECIEVE_MY_SIMILAR_PROFILE_LIST';
export const FAILURE_MY_SIMILAR_PROFILE_LIST =
	'FAILURE_MY_SIMILAR_PROFILE_LIST';
export const requestFetchMySimilarProfileList = (
	param = { offset: 0, limit: 10 }
) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/search?offset=${param.offset ||
			0}&limit=${param.limit || 10}`,
		types: [
			REQUEST_MY_SIMILAR_PROFILE_LIST,
			RECIEVE_MY_SIMILAR_PROFILE_LIST,
			FAILURE_MY_SIMILAR_PROFILE_LIST,
		],
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	},
});

// 與某人相似的人 (發佈後資料)
export const REQUEST_SIMILAR_PROFILE_LIST = 'REQUEST_SIMILAR_PROFILE_LIST';
export const RECIEVE_SIMILAR_PROFILE_LIST = 'RECIEVE_SIMILAR_PROFILE_LIST';
export const FAILURE_SIMILAR_PROFILE_LIST = 'FAILURE_SIMILAR_PROFILE_LIST';
export const requestFetchSimilarProfileList = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/search/similar?pid=${param.pid || -3}`,
		types: [
			REQUEST_SIMILAR_PROFILE_LIST,
			RECIEVE_SIMILAR_PROFILE_LIST,
			FAILURE_SIMILAR_PROFILE_LIST,
		],
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		bailout: () => !param.pid || param.pid === -3,
	},
});

// 編輯精選
export const REQUEST_FEATURED_PROFILE_LIST = 'REQUEST_FEATURED_PROFILE_LIST';
export const RECIEVE_FEATURED_PROFILE_LIST = 'RECIEVE_FEATURED_PROFILE_LIST';
export const FAILURE_FEATURED_PROFILE_LIST = 'FAILURE_FEATURED_PROFILE_LIST';
export const requestFetchFeaturedProfileList = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/search/choice`,
		types: [
			REQUEST_FEATURED_PROFILE_LIST,
			RECIEVE_FEATURED_PROFILE_LIST,
			FAILURE_FEATURED_PROFILE_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

// 發佈個人檔案
export const REQUEST_PUBLISH_PROFILE = 'REQUEST_PUBLISH_PROFILE';
export const RECIEVE_PUBLISH_PROFILE = 'RECIEVE_PUBLISH_PROFILE';
export const FAILURE_PUBLISH_PROFILE = 'FAILURE_PUBLISH_PROFILE';
export const requestPublishProfile = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/publish`,
		types: [
			REQUEST_PUBLISH_PROFILE,
			RECIEVE_PUBLISH_PROFILE,
			FAILURE_PUBLISH_PROFILE,
		],
		method: 'put',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
		error: response =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});

// 記錄來訪數
export const REQUEST_ADD_PROFILE_VISIT_COUNT =
	'REQUEST_ADD_PROFILE_VISIT_COUNT';
export const RECIEVE_ADD_PROFILE_VISIT_COUNT =
	'RECIEVE_ADD_PROFILE_VISIT_COUNT';
export const FAILURE_ADD_PROFILE_VISIT_COUNT =
	'FAILURE_ADD_PROFILE_VISIT_COUNT';
export const requestAddProfileVisitCount = param => {
	const endpointUrl = param.uuid
		? `${generalConfig.api}/users/${param.pid}/visit?uuid=${param.uuid}`
		: `${generalConfig.api}/users/${param.pid}/visit`;
	return {
		[RSAA]: {
			endpoint: endpointUrl,
			types: [
				REQUEST_ADD_PROFILE_VISIT_COUNT,
				RECIEVE_ADD_PROFILE_VISIT_COUNT,
				FAILURE_ADD_PROFILE_VISIT_COUNT,
			],
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(param),
			credentials: 'include',
			processMethod: 'takeLatest',
			// 自己的 pid 就不送
			bailout: state =>
				state.getIn(['user', 'pid']) === param.pid ||
				state.getIn(['user', 'pid']) === -3,
		},
	};
};

// 取得個人檔案分享設定
export const REQUEST_FETCH_PROFILE_SETTING = 'REQUEST_FETCH_PROFILE_SETTING';
export const RECIEVE_FETCH_PROFILE_SETTING = 'RECIEVE_FETCH_PROFILE_SETTING';
export const FAILURE_FETCH_PROFILE_SETTING = 'FAILURE_FETCH_PROFILE_SETTING';
export const requestFetchProfileSetting = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/share`,
		types: [
			REQUEST_FETCH_PROFILE_SETTING,
			RECIEVE_FETCH_PROFILE_SETTING,
			FAILURE_FETCH_PROFILE_SETTING,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		processMethod: 'every',
		next: (response, json) => setProfilePrivacy(json.type, json.token),
	},
});

// 更新個人檔案分享設定
export const REQUEST_UPDATE_PROFILE_SETTING = 'REQUEST_UPDATE_PROFILE_SETTING';
export const RECIEVE_UPDATE_PROFILE_SETTING = 'RECIEVE_UPDATE_PROFILE_SETTING';
export const FAILURE_UPDATE_PROFILE_SETTING = 'FAILURE_UPDATE_PROFILE_SETTING';
export const requestUpdateProfileSetting = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/share`,
		types: [
			REQUEST_UPDATE_PROFILE_SETTING,
			RECIEVE_UPDATE_PROFILE_SETTING,
			FAILURE_UPDATE_PROFILE_SETTING,
		],
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'every',
		next: (response, json) => setProfilePrivacy(json.type, json.token),
		bailout: () => !validPrivacyTypes.includes(param.type),
	},
});
