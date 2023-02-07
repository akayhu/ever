import RSAA from 'redux-api-middleware/lib/RSAA';
import isPlainObject from 'lodash.isplainobject';
import { Map, List } from 'immutable';
import pathToRegexp from 'path-to-regexp';
import Ajv from 'ajv';

//這邊原本想直接 import store 進來,但是會報錯,之後找找看是什麼問題

/**
 * Is the given action a plain JavaScript object with an [RSAA] property?
 *
 * @function isRSAA
 * @access public
 * @param {object} action - The action to check
 * @returns {boolean}
 */
function isRSAA(action) {
	return isPlainObject(action) && action.hasOwnProperty(RSAA);
}

/**
 * Is the given object a valid type descriptor?
 *
 * @function isValidTypeDescriptor
 * @access private
 * @param {object} obj - The object to check agains the type descriptor definition
 * @returns {boolean}
 */
function isValidTypeDescriptor(obj) {
	const validKeys = ['type', 'payload', 'meta'];

	if (!isPlainObject(obj)) {
		return false;
	}
	for (let key in obj) {
		if (!~validKeys.indexOf(key)) {
			return false;
		}
	}
	if (!('type' in obj)) {
		return false;
	} else if (typeof obj.type !== 'string' && typeof obj.type !== 'symbol') {
		return false;
	}

	return true;
}

/**
 * Checks an action against the RSAA definition, returning a (possibly empty)
 * array of validation errors.
 *
 * @function validateRSAA
 * @access public
 * @param {object} action - The action to check against the RSAA definition
 * @returns {array}
 */
function validateRSAA(action) {
	var validationErrors = [];
	const validCallAPIKeys = [
		'endpoint',
		'options',
		'method',
		'body',
		'headers',
		'credentials',
		'bailout',
		'types',
		'fetch',
		'before',
		'next',
		'error',
		'processMethod',
	];
	const validMethods = [
		'GET',
		'HEAD',
		'POST',
		'PUT',
		'PATCH',
		'DELETE',
		'OPTIONS',
	];
	const validCredentials = ['omit', 'same-origin', 'include'];
	const validProcessMethod = [
		'every',
		'debounce',
		'takeFirst',
		'takeLatest',
		'throttle',
	];

	if (!isRSAA(action)) {
		validationErrors.push(
			'RSAAs must be plain JavaScript objects with an [RSAA] property'
		);
		return validationErrors;
	}

	for (let key in action) {
		if (key !== RSAA) {
			validationErrors.push(`Invalid root key: ${key}`);
		}
	}

	const callAPI = action[RSAA];
	if (!isPlainObject(callAPI)) {
		validationErrors.push('[RSAA] property must be a plain JavaScript object');
	}
	for (let key in callAPI) {
		if (!~validCallAPIKeys.indexOf(key)) {
			validationErrors.push(`Invalid [RSAA] key: ${key}`);
		}
	}

	const {
		endpoint,
		method,
		headers,
		options,
		credentials,
		types,
		bailout,
		fetch,
		before,
		next,
		error,
		processMethod,
	} = callAPI;
	if (typeof endpoint === 'undefined') {
		validationErrors.push('[RSAA] must have an endpoint property');
	} else if (typeof endpoint !== 'string' && typeof endpoint !== 'function') {
		validationErrors.push(
			'[RSAA].endpoint property must be a string or a function'
		);
	}
	if (typeof method === 'undefined') {
		validationErrors.push('[RSAA] must have a method property');
	} else if (typeof method !== 'string') {
		validationErrors.push('[RSAA].method property must be a string');
	} else if (!~validMethods.indexOf(method.toUpperCase())) {
		validationErrors.push(`Invalid [RSAA].method: ${method.toUpperCase()}`);
	}

	if (
		typeof headers !== 'undefined' &&
		!isPlainObject(headers) &&
		typeof headers !== 'function'
	) {
		validationErrors.push(
			'[RSAA].headers property must be undefined, a plain JavaScript object, or a function'
		);
	}
	if (
		typeof options !== 'undefined' &&
		!isPlainObject(options) &&
		typeof options !== 'function'
	) {
		validationErrors.push(
			'[RSAA].options property must be undefined, a plain JavaScript object, or a function'
		);
	}
	if (typeof credentials !== 'undefined') {
		if (typeof credentials !== 'string') {
			validationErrors.push(
				'[RSAA].credentials property must be undefined, or a string'
			);
		} else if (!~validCredentials.indexOf(credentials)) {
			validationErrors.push(`Invalid [RSAA].credentials: ${credentials}`);
		}
	}
	if (
		typeof bailout !== 'undefined' &&
		typeof bailout !== 'boolean' &&
		typeof bailout !== 'function'
	) {
		validationErrors.push(
			'[RSAA].bailout property must be undefined, a boolean, or a function'
		);
	}

	if (typeof types === 'undefined') {
		validationErrors.push('[RSAA] must have a types property');
	} else if (!Array.isArray(types) || types.length !== 3) {
		validationErrors.push('[RSAA].types property must be an array of length 3');
	} else {
		const [requestType, successType, failureType] = types;
		if (
			typeof requestType !== 'string' &&
			typeof requestType !== 'symbol' &&
			!isValidTypeDescriptor(requestType)
		) {
			validationErrors.push('Invalid request type');
		}
		if (
			typeof successType !== 'string' &&
			typeof successType !== 'symbol' &&
			!isValidTypeDescriptor(successType)
		) {
			validationErrors.push('Invalid success type');
		}
		if (
			typeof failureType !== 'string' &&
			typeof failureType !== 'symbol' &&
			!isValidTypeDescriptor(failureType)
		) {
			validationErrors.push('Invalid failure type');
		}
	}

	if (typeof fetch !== 'undefined') {
		if (typeof fetch !== 'function') {
			validationErrors.push('[RSAA].fetch property must be a function');
		}
	}

	if (typeof before !== 'undefined') {
		if (typeof before !== 'function') {
			validationErrors.push('[RSAA].before property must be a function');
		}
	}

	if (typeof next !== 'undefined') {
		if (typeof next !== 'function') {
			validationErrors.push('[RSAA].next property must be a function');
		}
	}

	if (typeof error !== 'undefined') {
		if (typeof error !== 'function') {
			validationErrors.push('[RSAA].error property must be a function');
		}
	}

	if (typeof processMethod !== 'undefined') {
		if (
			typeof processMethod !== 'string' &&
			typeof processMethod !== 'function'
		) {
			validationErrors.push(
				'[RSAA].processMethod property must be a string, or a function'
			);
		} else if (
			typeof processMethod === 'string' &&
			!~validProcessMethod.indexOf(processMethod)
		) {
			validationErrors.push(`Invalid [RSAA].processMethod: ${processMethod}`);
		}
	}

	return validationErrors;
}

/**
 * Is the given action a valid RSAA?
 *
 * @function isValidRSAA
 * @access public
 * @param {object} action - The action to check against the RSAA definition
 * @returns {boolean}
 */
function isValidRSAA(action) {
	return !validateRSAA(action).length;
}

/**
 * 檢查目前所在環境
 * @function isValidStage
 * @param {array} validStages
 * @param {string} stage
 * @returns {boolean}
 */
const isValidStage = (
	validStages = ['local'],
	stage = process.env.REACT_APP_STAGE
) => {
	if (typeof stage !== 'string' || !Array.isArray(validStages)) {
		console.error(
			'validStages must be string array in function isValidStage.',
			validStages
		);
		return false;
	}
	return validStages.indexOf(stage) !== -1;
};

/**
 * 檢查是否為 uuid 格式
 * @param {*} str
 * @returns {boolean}
 */
const isUUID = str => {
	let result = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(
		str
	);
	if (!result) console.warn('str is not a valid uuid format.', str);
	return result;
};

/**
 * 過濾 html tag
 * @param {*} str
 * @returns {string}
 */
const tripHtml = str => {
	return str.replace(/(<([^>]+)>)/gi, '');
};

/**
 * 檢查 data 是否符合 schema
 * @param {object} dataModel
 * @param {object} dataModelSchema
 * @returns {boolean}
 */

let validationHintSet = [];
let maxLengthHintSet = [];
let checkTypeSet = [];

const validateDataModel = (dataModel = {}, dataModelSchema, type) => {
	const ajv = new Ajv();
	if (!dataModelSchema || !ajv.validateSchema(dataModelSchema)) {
		console.error(
			'[validateDataModel] invalid dataModelSchema: ',
			dataModelSchema
		);
		return false;
	}

	// 處理 description 過濾掉 html tag
	const _dataModel = {
		...dataModel,
		description: tripHtml(dataModel.description || ''),
	};
	// 檢查 schema 格式 & 驗證 data model
	const result = ajv.validate(dataModelSchema, _dataModel);
	//儲存錯誤欄位訊息
	let validationHintInfo = Map();
	if (ajv.errors && checkTypeSet.indexOf(type) === -1) {
		const fileIdErrExist =
			ajv.errors[0]['schemaPath'].includes('fileId') ||
			ajv.errors[0]['message'].includes('fileId');
		const errorKeyword = ajv.errors[0]['keyword'];
		if (errorKeyword === 'maxLength') {
			validationHintInfo = validationHintInfo.set(type, errorKeyword);
			maxLengthHintSet.push(validationHintInfo.toJS());
		} else if (errorKeyword !== 'maxLength' && !fileIdErrExist) {
			type === 'custom'
				? (validationHintInfo = validationHintInfo
						.set(type, errorKeyword)
						.set('unikey', dataModel.customId))
				: (validationHintInfo = validationHintInfo.set(type, errorKeyword));
			validationHintSet.push(validationHintInfo.toJS());
		} else if (errorKeyword !== 'maxLength' && fileIdErrExist) {
			validationHintInfo = validationHintInfo.set(type, 'fileId');
			validationHintSet.push(validationHintInfo.toJS());
		}
		checkTypeSet.push(type);
	}

	if (!result) {
		console.warn(
			`[validateDataModel] invalid dataModel | error: ${ajv.errorsText()} | dataModel:`,
			dataModel
		);
	}
	return result;
};

/**
 * 檢查是否有任何未填寫的必填欄位
 * fixme 這邊為了檢查 fileId, 額外寫了 honorSchema,之後嘗試優化
 * @param {Map} config
 * @param {Map} data
 * @returns {boolean}
 */
const isAllRequiredFieldDone = (
	config = Map(),
	data = Map(),
	schemaMap = {},
	honorSchemaMap = {}
) => {
	validationHintSet = [];
	maxLengthHintSet = [];
	checkTypeSet = [];
	if (!Map.isMap(config)) {
		console.error('config must be Map in isAllRequiredFieldDone', config);
		return false;
	}

	if (!Map.isMap(data)) {
		console.error('data must be Map in isAllRequiredFieldDone', data);
		return false;
	}

	// 檢查是否含有不合法 blockType
	const isAllValidBlockType = config.every(block =>
		schemaMap.hasOwnProperty(block.get('blockType', 'unknown'))
	);

	if (!isAllValidBlockType) {
		console.error('Find invalid blockType in config', config.toJS());
		return false;
	}

	let validationArr = config
		// 只檢查 visibility: 為 true 的區塊
		.filter(block => block.get('visibility'))
		.map(block => {
			const type = block.get('blockType', 'unknown');
			const templateType = block.get('templateType', 'unknown');
			const noFileTemplates = ['def', 'text'];
			const doNotCheckFile =
				type === 'honor' && noFileTemplates.includes(templateType);
			const blockId = block.get('uniKey');
			const blockData = data.get(blockId);
			if (List.isList(blockData)) {
				return blockData.map(model => {
					if (Map.isMap(model) || List.isList(model)) {
						return validateDataModel(
							model.toJS(),
							!doNotCheckFile ? schemaMap[type] : honorSchemaMap[type],
							type,
							templateType
						);
					}

					return validateDataModel(
						model,
						!doNotCheckFile ? schemaMap[type] : honorSchemaMap[type],
						type,
						templateType
					);
				});
			}
			if (Map.isMap(blockData)) {
				return validateDataModel(
					blockData.toJS(),
					!doNotCheckFile ? schemaMap[type] : honorSchemaMap[type],
					type,
					templateType
				);
			}

			return validateDataModel(
				blockData,
				!doNotCheckFile ? schemaMap[type] : honorSchemaMap[type],
				type,
				templateType
			);
		})
		//檢查 List 是否含有 false, 若有則回傳 false, 接著過濾掉 true 值
		.map(block => {
			if (List.isList(block)) {
				return block.includes(false) ? false : true;
			}
			return block;
		})
		.filter(block => !block)
		.toArray();

	//過濾後的陣列長度若大於 0 則表示至少有一個 block 未填寫
	return validationArr.length > 0 ? false : true;
};

/**
 * 檢查是否為指定的 path
 * path 格式參照 pathToRegexp
 * @param {*} routes
 * @param {*} path
 */
const isValidRoute = (
	routes = [],
	path = window.location.href.replace(window.location.origin, '')
) => {
	for (let i = 0; i < routes.length; i++) {
		// null or array
		if (pathToRegexp(routes[i]).exec(path)) return true;
	}
	return false;
};

export {
	isRSAA,
	isValidTypeDescriptor,
	validateRSAA,
	isValidRSAA,
	isValidStage,
	isValidRoute,
	isUUID,
	validateDataModel,
	isAllRequiredFieldDone,
	validationHintSet,
	maxLengthHintSet,
};
