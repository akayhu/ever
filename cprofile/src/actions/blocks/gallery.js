import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { logout } from 'actions/user';

/**
 * [API] 取得作品列表
 * @param {*} param pid required
 */
export const REQUEST_FETCH_GALLERY_LIST = 'REQUEST_FETCH_GALLERY_LIST';
export const RECIEVE_FETCH_GALLERY_LIST = 'RECIEVE_FETCH_GALLERY_LIST';
export const FAILURE_FETCH_GALLERY_LIST = 'FAILURE_FETCH_GALLERY_LIST';
export const requestFetchGalleryList = (param = { pid: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/galleries`,
		types: [
			REQUEST_FETCH_GALLERY_LIST,
			RECIEVE_FETCH_GALLERY_LIST,
			FAILURE_FETCH_GALLERY_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 取得單筆作品
 * @param {*} param pid required
 */
export const REQUEST_FETCH_GALLERY = 'REQUEST_FETCH_GALLERY';
export const RECIEVE_FETCH_GALLERY = 'RECIEVE_FETCH_GALLERY';
export const FAILURE_FETCH_GALLERY = 'FAILURE_FETCH_GALLERY';
export const requestFetchGallery = (param = { pid: -3, galleryId: -3 }) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/galleries/${
			param.galleryId
		}`,
		types: [
			REQUEST_FETCH_GALLERY,
			RECIEVE_FETCH_GALLERY,
			FAILURE_FETCH_GALLERY,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	},
});

/**
 * [API] 新增一筆作品
 * @param {*} param
 */
export const REQUEST_CREATE_GALLERY = 'REQUEST_CREATE_GALLERY';
export const RECIEVE_CREATE_GALLERY = 'RECIEVE_CREATE_GALLERY';
export const FAILURE_CREATE_GALLERY = 'FAILURE_CREATE_GALLERY';
export const requestCreateGallery = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/galleries`,
		types: [
			REQUEST_CREATE_GALLERY,
			RECIEVE_CREATE_GALLERY,
			FAILURE_CREATE_GALLERY,
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
 * [API] 更新一筆作品
 * @param {*} param
 */
export const REQUEST_UPDATE_GALLERY = 'REQUEST_UPDATE_GALLERY';
export const RECIEVE_UPDATE_GALLERY = 'RECIEVE_UPDATE_GALLERY';
export const FAILURE_UPDATE_GALLERY = 'FAILURE_UPDATE_GALLERY';
export const requestUpdateGallery = param => {
	delete param['fileUrlMap'];
	return {
		[RSAA]: {
			endpoint: `${generalConfig.api}/users/${param.pid}/galleries/${
				param.galleryId
			}`,
			types: [
				REQUEST_UPDATE_GALLERY,
				RECIEVE_UPDATE_GALLERY,
				FAILURE_UPDATE_GALLERY,
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
 * [API] 刪除一筆作品
 * @param {*} param
 */
export const REQUEST_DELETE_GALLERY = 'REQUEST_DELETE_GALLERY';
export const RECIEVE_DELETE_GALLERY = 'RECIEVE_DELETE_GALLERY';
export const FAILURE_DELETE_GALLERY = 'FAILURE_DELETE_GALLERY';
export const requestDeleteGallery = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/galleries/${
			param.galleryId
		}`,
		types: [
			REQUEST_DELETE_GALLERY,
			RECIEVE_DELETE_GALLERY,
			FAILURE_DELETE_GALLERY,
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
