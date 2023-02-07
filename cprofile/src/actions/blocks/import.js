import { RSAA } from 'redux-api-middleware';
import { Set } from 'immutable';
import { logout } from 'actions/user';
import { processingStart, processingEnd } from 'actions/process';
import generalConfig from 'config/general';

// 可匯入的第三方服務名稱
export const validServiceName = Set(['my104']);

// 更新 reducer 匯入服務狀態
export const UPDATE_IMPORT_SERVICE_STATUS = 'UPDATE_IMPORT_SERVICE_STATUS';
export const updateImportServiceStatus = (serviceName, payload, callback) => ({
	type: UPDATE_IMPORT_SERVICE_STATUS,
	serviceName,
	payload,
	callback,
});

// 執行匯入程序
export const IMPORT_PROCESS = 'IMPORT_PROCESS';
export const importProcess = (payload, callback) => ({
	type: IMPORT_PROCESS,
	payload,
	callback,
});

// 取得所有引入服務的狀態 (有無資料)
export const REQUEST_IMPORT_SERVICE_STATUS = 'REQUEST_IMPORT_SERVICE_STATUS';
export const RECIEVE_IMPORT_SERVICE_STATUS = 'RECIEVE_IMPORT_SERVICE_STATUS';
export const FAILURE_IMPORT_SERVICE_STATUS = 'FAILURE_IMPORT_SERVICE_STATUS';
export const requestImportServiceStatus = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/import/${
			param.serviceName
		}/hasData`,
		types: [
			REQUEST_IMPORT_SERVICE_STATUS,
			RECIEVE_IMPORT_SERVICE_STATUS,
			FAILURE_IMPORT_SERVICE_STATUS,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		bailout: () => {
			const check =
				!param.serviceName || !validServiceName.includes(param.serviceName);
			if (check)
				console.error(
					'Invalid Service Name in requestImportServiceDetail',
					param
				);
			return check;
		},
		before: () => processingStart(param.serviceName, 'importServiceStatus'),
		next: (response, json) => [
			updateImportServiceStatus(param.serviceName, { hasData: json }),
			processingEnd(param.serviceName, 'importServiceStatus'),
		],
		error: (response, json) =>
			processingEnd(param.serviceName, 'importServiceStatus'),
	},
});

// 取得單個引入服務的詳細資料
export const REQUEST_IMPORT_SERVICE_DETAIL = 'REQUEST_IMPORT_SERVICE_DETAIL';
export const RECIEVE_IMPORT_SERVICE_DETAIL = 'RECIEVE_IMPORT_SERVICE_DETAIL';
export const FAILURE_IMPORT_SERVICE_DETAIL = 'FAILURE_IMPORT_SERVICE_DETAIL';
export const requestImportServiceDetail = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/import/${
			param.serviceName
		}/blocks`,
		types: [
			REQUEST_IMPORT_SERVICE_DETAIL,
			RECIEVE_IMPORT_SERVICE_DETAIL,
			FAILURE_IMPORT_SERVICE_DETAIL,
		],
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		bailout: () => {
			const check =
				!param.serviceName || !validServiceName.includes(param.serviceName);
			if (check)
				console.error(
					'Invalid Service Name in requestImportServiceDetail',
					param
				);
			return check;
		},
		before: () => processingStart(param.serviceName, 'importServiceDetail'),
		next: (response, json) => [
			updateImportServiceStatus(param.serviceName, { rawData: json }),
			processingEnd(param.serviceName, 'importServiceDetail'),
		],
	},
});

// 要求匯入區塊
export const REQUEST_IMPORT_BLOCKS = 'REQUEST_IMPORT_BLOCKS';
export const RECIEVE_IMPORT_BLOCKS = 'RECIEVE_IMPORT_BLOCKS';
export const FAILURE_IMPORT_BLOCKS = 'FAILURE_IMPORT_BLOCKS';
export const requestImportBlocks = param => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${param.pid}/import/${
			param.serviceName
		}`,
		types: [
			REQUEST_IMPORT_BLOCKS,
			RECIEVE_IMPORT_BLOCKS,
			FAILURE_IMPORT_BLOCKS,
		],
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param.selectedBlocks),
		credentials: 'include',
		bailout: () => {
			const check =
				!param.serviceName || !validServiceName.includes(param.serviceName);
			if (check)
				console.error('Invalid Service Name in requestImportBlocks', param);
			return check;
		},
		before: () => processingStart(param.serviceName, 'importBlocks'),
		next: (response, json) => processingEnd(param.serviceName, 'importBlocks'),
		error: (response, json) =>
			response.status === 401 || response.status === 403 ? logout() : [],
	},
});
