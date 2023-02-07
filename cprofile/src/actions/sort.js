import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import { Set, is } from 'immutable';
import { logout } from 'actions/user';

// 更新特定 type 的排序資料
export const REQUEST_UPDATE_SORT_LIST = 'REQUEST_UPDATE_SORT_LIST';
export const RECIEVE_UPDATE_SORT_LIST = 'RECIEVE_UPDATE_SORT_LIST';
export const FAILURE_UPDATE_SORT_LIST = 'FAILURE_UPDATE_SORT_LIST';
export const requestUpdateSortList = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/sort/${param.type}`,
		types: [
			REQUEST_UPDATE_SORT_LIST,
			RECIEVE_UPDATE_SORT_LIST,
			FAILURE_UPDATE_SORT_LIST,
		],
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		processMethod: 'takeLatest',
		error: response => {
			console.error('更新 sort API 資料失敗', response);
			return [401, 403].includes(response.status) ? logout() : undefined;
		},
		bailout: state => {
			const { pid, type } = param;
			const acceptTypes = Set(['BLOCK', 'HONOR', 'TALENT', 'GALLERY']);
			const sortInfoKeys = Set(['pid', 'sortList', 'type']);
			const paramKeys = Set.fromKeys(param);
			if (!acceptTypes.has(type)) {
				console.error('Find invalid sort type: ', type);
			} else if (!is(paramKeys, sortInfoKeys)) {
				console.error(
					'Find invalid sortList when requestUpdateSortList: ',
					paramKeys.toJS()
				);
			}
			return (
				!pid ||
				pid === -3 ||
				!acceptTypes.has(type) ||
				!is(paramKeys, sortInfoKeys)
			);
		},
	},
});

// 執行更新 sort 的程序
export const UPDATE_SORT_PROCESS = 'UPDATE_SORT_PROCESS';
export const updateSortProcess = (sortType, payload = {}) => ({
	type: UPDATE_SORT_PROCESS,
	sortType,
	payload,
});
