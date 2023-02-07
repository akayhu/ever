import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import nameMap from 'config/nameMap';
import { Set, is } from 'immutable';
import { initCard } from '../ui/card';
import { logout } from 'actions/user';
import { connectorValidBlockTypes, updateConnectorStatus } from './connector';

/**
 * 進入頁面時拉取所有區塊資料
 * @param {string} page
 */
export const FETCH_ALL_DATA_PROCESS_START = 'FETCH_ALL_DATA_PROCESS_START';
export const fetchAllDataProcessStart = (pid = -3) => ({
	type: FETCH_ALL_DATA_PROCESS_START,
	pid,
});

export const FETCH_ALL_DATA_PROCESS_END = 'FETCH_ALL_DATA_PROCESS_END';
export const fetchAllDataProcessEnd = (pid = -3) => ({
	type: FETCH_ALL_DATA_PROCESS_END,
	pid,
});

export const FETCH_ALL_DATA_PROCESS_ERROR = 'FETCH_ALL_DATA_PROCESS_ERROR';
export const fetchAllDataProcessError = (pid = -3, msg = '', error) => ({
	type: FETCH_ALL_DATA_PROCESS_ERROR,
	pid,
	msg,
	error,
});

/**
 * 區塊更新流程
 *
 * @param {string} uniKey
 * @param {object} payload
 *  { index, value, feild }
 * @param {object} metadata metadata 格式如下
 *  {
 *    dataModelSchema: {
 *      type: 'object',
 *      required: ['property1', .....] 必填欄位
 *    },
 *    updater: {
 *      create,           新增資料的 action creator (basic 不用帶)
 *      update,           修改資料的 action creator [required]
 *      successConst,     API 成功的 action const array  [required]
 *      failConst,        API 失敗的 action const array  [required]
 *      filterHTML: true  是否要過濾 html
 *    },
 *    hooks: {
 *      validateError,    驗證 dataModel 失敗要執行的 callback
 *      shouldUpdateData, 驗證成功後，是否要送 API request的判斷 callback
 *      updateSuccess,    更新資料成功後執行的 callback
 *      updateError       更新資料失敗後執行的 callback
 *    }
 *  }
 */
export const BLOCK_DATA_UPDATE_PROCESS_START =
	'BLOCK_DATA_UPDATE_PROCESS_START';
export const blockDataUpdateProcessStart = (
	uniKey = '',
	payload = {},
	metadata = {},
	hooks = {},
	convertType
) => ({
	type: BLOCK_DATA_UPDATE_PROCESS_START,
	uniKey,
	payload,
	metadata,
	hooks,
	convertType,
});

/**
 * 區塊更新成功
 */
export const BLOCK_DATA_UPDATE_PROCESS_END = 'BLOCK_DATA_UPDATE_PROCESS_END';
export const blockDataUpdateProcessEnd = (uniKey = '') => ({
	type: BLOCK_DATA_UPDATE_PROCESS_END,
	uniKey,
});

/**
 * 區塊更新失敗
 */
export const BLOCK_DATA_UPDATE_PROCESS_ERROR =
	'BLOCK_DATA_UPDATE_PROCESS_ERROR';
export const blockDataUpdateProcessError = (uniKey = '', error) => ({
	type: BLOCK_DATA_UPDATE_PROCESS_ERROR,
	uniKey,
	error,
});

/**
 * 驗證 data model 失敗
 */
export const VALIDATE_DATAMODEL_ERROR = 'VALIDATE_DATAMODEL_ERROR';
export const validateDataModelError = (name = '', input, error) => ({
	type: VALIDATE_DATAMODEL_ERROR,
	name,
	input,
	error,
});

/**
 * 開始更新 Block API
 */
export const BLOCK_SETTING_UPDATE_PROCESS_START =
	'BLOCK_SETTING_UPDATE_PROCESS_START';
export const blockSettingUpdateProcessStart = (uniKey = '') => ({
	type: BLOCK_SETTING_UPDATE_PROCESS_START,
	uniKey,
});

/**
 * 更新 Block API 成功
 */
export const BLOCK_SETTING_UPDATE_PROCESS_END =
	'BLOCK_SETTING_UPDATE_PROCESS_END';
export const blockSettingUpdateProcessEnd = (uniKey = '') => ({
	type: BLOCK_SETTING_UPDATE_PROCESS_END,
	uniKey,
});

/**
 * 更新 Block API 失敗
 */
export const BLOCK_SETTING_UPDATE_PROCESS_ERROR =
	'BLOCK_SETTING_UPDATE_PROCESS_ERROR';
export const blockSettingUpdateProcessError = (uniKey = '', error) => ({
	type: BLOCK_SETTING_UPDATE_PROCESS_ERROR,
	uniKey,
	error,
});

/**
 * hook 非同步處理的狀態變更
 */
export const CHANGE_HOOK_PROCESS_STATUS = 'CHANGE_HOOK_PROCESS_STATUS';
export const changeHookProcessStatus = (hookname, status) => ({
	type: CHANGE_HOOK_PROCESS_STATUS,
	hookname,
	status,
});

/**
 * 取得所有區塊屬性資料
 * @param {object} param
 */
export const REQUEST_FETCH_BLOCK_LIST = 'REQUEST_FETCH_BLOCK_LIST';
export const RECIEVE_FETCH_BLOCK_LIST = 'RECIEVE_FETCH_BLOCK_LIST';
export const FAILURE_FETCH_BLOCK_LIST = 'FAILURE_FETCH_BLOCK_LIST';
export const requestFetchBlockList = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/blocks`,
		types: [
			REQUEST_FETCH_BLOCK_LIST,
			RECIEVE_FETCH_BLOCK_LIST,
			FAILURE_FETCH_BLOCK_LIST,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		error: response => {
			console.error('取得 Block API 資料失敗', response);
		},
		bailout: () => !param.pid || param.pid === -3,
	},
});

/**
 * 取得單一區塊屬性資料
 * @param {object} param
 */
export const REQUEST_FETCH_BLOCK = 'REQUEST_FETCH_BLOCK';
export const RECIEVE_FETCH_BLOCK = 'RECIEVE_FETCH_BLOCK';
export const FAILURE_FETCH_BLOCK = 'FAILURE_FETCH_BLOCK';
export const requestFetchBlock = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/blocks/${param.blockId}`,
		types: [REQUEST_FETCH_BLOCK, RECIEVE_FETCH_BLOCK, FAILURE_FETCH_BLOCK],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		error: response => {
			console.error('取得 Block API 資料失敗', response);
		},
		bailout: () => !param.blockId || !param.pid || param.pid === -3,
	},
});

/**
 * 建立區塊
 * @param {object} param
 */
export const REQUEST_CREATE_BLOCK = 'REQUEST_CREATE_BLOCK';
export const RECIEVE_CREATE_BLOCK = 'RECIEVE_CREATE_BLOCK';
export const FAILURE_CREATE_BLOCK = 'FAILURE_CREATE_BLOCK';
export const requestCreateBlock = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/blocks`,
		types: [REQUEST_CREATE_BLOCK, RECIEVE_CREATE_BLOCK, FAILURE_CREATE_BLOCK],
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		// next: (response, json) => updateBlockUniKey(json),
		error: response => {
			console.error('新建 Block API 資料失敗', response);
			return response.status === 401 || response.status === 403 ? logout() : [];
		},
		// bailout: () => {
		//   const { pid, type } = param;
		//   const BlockInfoKeys = Set(['type', 'template', 'visibility']);
		//   const paramKeys = Set.fromKeys(param);
		//   if (!is(paramKeys, BlockInfoKeys)) {
		//     console.error('Find invalid blockInfo when requestCreateBlock: ', paramKeys.toJS());
		//   }
		//   return (!pid || pid === -3 || !is(paramKeys, BlockInfoKeys))
		// },
	},
});

/**
 * 更新單一區塊屬性資料
 * @param {object} param
 */
export const REQUEST_UPDATE_BLOCK = 'REQUEST_UPDATE_BLOCK';
export const RECIEVE_UPDATE_BLOCK = 'RECIEVE_UPDATE_BLOCK';
export const FAILURE_UPDATE_BLOCK = 'FAILURE_UPDATE_BLOCK';
export const requestUpdateBlock = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/blocks/${param.blockId}`,
		types: [REQUEST_UPDATE_BLOCK, RECIEVE_UPDATE_BLOCK, FAILURE_UPDATE_BLOCK],
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		error: response => {
			console.error('更新 Block API 資料失敗', response);
			return response.status === 401 || response.status === 403 ? logout() : [];
		},
		bailout: () => {
			const { pid } = param;
			const BlockInfoKeys = Set([
				'type',
				'template',
				'blockId',
				'pid',
				'visibility',
				'mask',
			]);
			const paramKeys = Set.fromKeys(param);
			if (!is(paramKeys, BlockInfoKeys)) {
				console.error(
					'Find invalid blockInfo when requestUpdateBlock: ',
					paramKeys.toJS()
				);
			}
			return !pid || pid === -3 || !is(paramKeys, BlockInfoKeys);
		},
	},
});

/**
 * 刪除單一區塊屬性資料
 * @param {object} param
 */
export const REQUEST_DELETE_BLOCK = 'REQUEST_DELETE_BLOCK';
export const RECIEVE_DELETE_BLOCK = 'RECIEVE_DELETE_BLOCK';
export const FAILURE_DELETE_BLOCK = 'FAILURE_DELETE_BLOCK';
export const requestDeleteBlock = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/blocks/${param.blockId}`,
		types: [REQUEST_DELETE_BLOCK, RECIEVE_DELETE_BLOCK, FAILURE_DELETE_BLOCK],
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		credentials: 'include',
		error: response => {
			console.error('刪除 Block API 資料失敗', response);
			return response.status === 401 || response.status === 403 ? logout() : [];
		},
		bailout: () => {
			const { pid } = param;
			const BlockInfoKeys = Set([
				'type',
				'template',
				'blockId',
				'pid',
				'visibility',
				'mask',
			]);
			const paramKeys = Set.fromKeys(param);
			if (!is(paramKeys, BlockInfoKeys)) {
				console.error(
					'Find invalid blockInfo when requestDeleteBlock: ',
					paramKeys.toJS()
				);
			}
			return !pid || pid === -3 || !is(paramKeys, BlockInfoKeys);
		},
	},
});

export const REQUEST_BLOCK_DATA = 'REQUEST_BLOCK_DATA';
export const RECIEVE_BLOCK_DATA = 'RECIEVE_BLOCK_DATA';
export const FAILURE_BLOCK_DATA = 'FAILURE_BLOCK_DATA';
export const requestBlockData = (uniKey, blockType, templateType, param) => {
	const endpoint =
		blockType === 'custom'
			? `customs/${uniKey}`
			: `${nameMap[blockType] && nameMap[blockType].endpoint}`;
	return {
		[RSAA]: {
			endpoint: `${generalConfig.api}/users/${param.pid}/${endpoint}`,
			types: [REQUEST_BLOCK_DATA, RECIEVE_BLOCK_DATA, FAILURE_BLOCK_DATA],
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			bailout: () => {
				if (blockType in nameMap && endpoint) return false;
				// 不認識的 blockType 或找不到 endpoint
				console.error('不合法的 blockType or endpoint', {
					uniKey,
					blockType,
					templateType,
					param,
				});
				return true;
			},
			next: (response, json) => {
				// REFACTOR: 想把 block action next 部分搬回來，但遇上 blockConfig 和 blockData mapping 順序不固定問題
				// 只能等到 processAPI 支援 custom dispatched FSAs 才能解
				let actions = [];
				actions.push(initCard(uniKey, blockType, templateType, json));

				// connector 有快照, 代表有 token
				if (connectorValidBlockTypes.includes(blockType)) {
					actions.push(
						updateConnectorStatus(blockType, {
							hasToken: true,
							hasSnapshot: true,
							errorMessage: null,
						})
					);
				}
				return actions;
			},
			error: (response, json) => {
				console.error(`獲取 ${blockType} 區塊的 API 資料失敗`, response);
				return [initCard(uniKey, blockType, templateType, null)];
			},
		},
	};
};
