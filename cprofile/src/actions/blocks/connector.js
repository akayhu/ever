import { RSAA } from 'redux-api-middleware';
import generalConfig from 'config/general';
import fetchJsonp from 'fetch-jsonp';
import { Set } from 'immutable';
import { logout } from 'actions/user';
import { processingStart, processingEnd } from 'actions/process';
import { sendToDataLayer } from 'utils/gtmDataLayer';

// 可用的第三方服務 blockTypes
export const connectorValidBlockTypes = Set(['github', 'behance']);

// 更新第三方服務連結狀態
export const UPDATE_CONNECTOR_STATUS = 'UPDATE_CONNECTOR_STATUS';
export const updateConnectorStatus = (blockType, payload) => ({
	type: UPDATE_CONNECTOR_STATUS,
	blockType,
	payload,
});

// 取得第三方服務 API 原始資料
export const REQUEST_FETCH_CONNECTOR_RAW_DATA =
	'REQUEST_FETCH_CONNECTOR_RAW_DATA';
export const RECIEVE_FETCH_CONNECTOR_RAW_DATA =
	'RECIEVE_FETCH_CONNECTOR_RAW_DATA';
export const FAILURE_FETCH_CONNECTOR_RAW_DATA =
	'FAILURE_FETCH_CONNECTOR_RAW_DATA';
export const requestFetchConnectorRawData = (blockType, param) => {
	// 因 API 額度考量，針對 behance 改從 client 拿原始資料
	const endpoint =
		blockType === 'behance'
			? `https://www.behance.net/v2/users/${param.key}/projects?client_id=${
					generalConfig.behance
			  }`
			: `${generalConfig.api}/users/${param.pid}/connectors/${blockType.replace(
					'_',
					'-'
			  )}`;

	return {
		[RSAA]: {
			endpoint,
			types: [
				REQUEST_FETCH_CONNECTOR_RAW_DATA,
				RECIEVE_FETCH_CONNECTOR_RAW_DATA,
				FAILURE_FETCH_CONNECTOR_RAW_DATA,
			],
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			fetch: async (endpoint, options) => {
				// 因 API 額度考量，針對 behance 改從 client 拿原始資料
				if (blockType === 'behance') {
					const jsonp = await fetchJsonp(endpoint, { mode: 'no-cors' })
						.then(response => response.json())
						.catch(error => ({ http_code: 500, error }));

					return new Response(JSON.stringify(jsonp), {
						// behance 沒拉到資料，視為沒有 token
						status: jsonp.http_code === 500 ? 403 : jsonp.http_code,
						headers: {
							'Content-Type': 'application/json',
						},
					});
				}
				// 其他都打後端的口拿原始資料
				return await fetch(endpoint, options);
			},
			bailout: () => {
				if (!connectorValidBlockTypes.includes(blockType)) {
					console.error(
						'Find invalid blockType when requestConnectorRawData: ',
						blockType
					);
					return true;
				}
				if (!param.pid || param.pid === -3) {
					console.error(
						'Find invalid pid when requestConnectorRawData: ',
						param.pid
					);
					return true;
				}
				return false;
			},
			before: () => processingStart('fetchConnectorRawData', blockType),
			next: (response, json) => {
				// REFACTOR: github 拿得到 rawData 代表有 token
				if (blockType === 'github') {
					sendToDataLayer({ githubConnect: true });
				}
				return [
					updateConnectorStatus(blockType, {
						hasToken: true,
						rawData: json,
						errorMessage: null,
					}),
					processingEnd('fetchConnectorRawData', blockType),
				];
			},
			error: (response, json) => {
				// REFACTOR: github 拿不到 rawData 代表沒有 token
				if (blockType === 'github') {
					sendToDataLayer({ githubConnect: false });
				}
				return response.status === 403
					? [
							updateConnectorStatus(blockType, {
								hasToken: false,
								rawData: json,
								errorMessage: 'invalidId',
							}),
							processingEnd('fetchConnectorRawData', blockType),
					  ]
					: processingEnd('fetchConnectorRawData', blockType);
			},
		},
	};
};

// 取得第三方服務的快照
export const REQUEST_FETCH_CONNECTOR_SNAPSHOT =
	'REQUEST_FETCH_CONNECTOR_SNAPSHOT';
export const RECIEVE_FETCH_CONNECTOR_SNAPSHOT =
	'RECIEVE_FETCH_CONNECTOR_SNAPSHOT';
export const FAILURE_FETCH_CONNECTOR_SNAPSHOT =
	'FAILURE_FETCH_CONNECTOR_SNAPSHOT';
export const requestFetchConnectorSnapshot = (blockType, param) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${
			param.pid
		}/connectors/${blockType}/snapshot`,
		types: [
			REQUEST_FETCH_CONNECTOR_SNAPSHOT,
			RECIEVE_FETCH_CONNECTOR_SNAPSHOT,
			FAILURE_FETCH_CONNECTOR_SNAPSHOT,
		],
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		bailout: () => {
			if (!connectorValidBlockTypes.includes(blockType)) {
				console.error(
					'Find invalid blockType when requestConnectorSnapshot: ',
					blockType
				);
				return true;
			}
			if (!param.pid || param.pid === -3) {
				console.error(
					'Find invalid pid when requestConnectorSnapshot: ',
					param.pid
				);
				return true;
			}
			return false;
		},
		next: (response, json) =>
			updateConnectorStatus(blockType, {
				hasToken: true,
				hasSnapshot: true,
				errorMessage: null,
			}),
		error: (response, json) => {
			// connector 無快照,可能有無 token，待後續發 API 決定
			if (response.status === 404) {
				return updateConnectorStatus(blockType, {
					hasToken: false,
					hasSnapshot: false,
				});
			}
		},
	},
});

// 新增第三方服務的快照
export const REQUEST_CREATE_CONNECTOR_SNAPSHOT =
	'REQUEST_CREATE_CONNECTOR_SNAPSHOT';
export const RECIEVE_CREATE_CONNECTOR_SNAPSHOT =
	'RECIEVE_CREATE_CONNECTOR_SNAPSHOT';
export const FAILURE_CREATE_CONNECTOR_SNAPSHOT =
	'FAILURE_CREATE_CONNECTOR_SNAPSHOT';
export const requestCreateConnectorSnapshot = (blockType, param) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${
			param.pid
		}/connectors/${blockType.replace('_', '-')}/snapshot`,
		types: [
			REQUEST_CREATE_CONNECTOR_SNAPSHOT,
			RECIEVE_CREATE_CONNECTOR_SNAPSHOT,
			FAILURE_CREATE_CONNECTOR_SNAPSHOT,
		],
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		processMethod: 'takeLatest',
		bailout: () => {
			if (!connectorValidBlockTypes.includes(blockType)) {
				console.error(
					'Find invalid blockType when requestConnectorSnapshot: ',
					blockType
				);
				return true;
			}
			if (!param.pid || param.pid === -3) {
				console.error(
					'Find invalid pid when requestConnectorSnapshot: ',
					param.pid
				);
				return true;
			}
			return false;
		},
		next: (response, json) => {
			// REFACTOR: behance 新增一筆快照
			if (blockType === 'behance') {
				sendToDataLayer({ behanceConnect: true });
			}
			return updateConnectorStatus(blockType, {
				hasSnapshot: true,
				errorMessage: null,
			});
		},
		error: (response, json) =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});

// 刪除第三方服務的快照
export const REQUEST_DELETE_CONNECTOR_SNAPSHOT =
	'REQUEST_DELETE_CONNECTOR_SNAPSHOT';
export const RECIEVE_DELETE_CONNECTOR_SNAPSHOT =
	'RECIEVE_DELETE_CONNECTOR_SNAPSHOT';
export const FAILURE_DELETE_CONNECTOR_SNAPSHOT =
	'FAILURE_DELETE_CONNECTOR_SNAPSHOT';
export const requestDeleteConnectorSnapshot = (blockType, param) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/users/${
			param.pid
		}/connectors/${blockType}/snapshot`,
		types: [
			REQUEST_DELETE_CONNECTOR_SNAPSHOT,
			RECIEVE_DELETE_CONNECTOR_SNAPSHOT,
			FAILURE_DELETE_CONNECTOR_SNAPSHOT,
		],
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(param),
		processMethod: 'takeLatest',
		bailout: () => {
			if (!param.pid || param.pid === -3) {
				console.error(
					'Find invalid pid when requestConnectorSnapshot: ',
					param.pid
				);
				return true;
			}
			return false;
		},
		next: (response, json) =>
			updateConnectorStatus(blockType, {
				hasSnapshot: false,
				errorMessage: null,
			}),
		error: (response, json) =>
			[401, 403].includes(response.status) ? logout() : undefined,
	},
});
