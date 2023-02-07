import {
	processingStart,
	processingEnd,
	PROCESSING_START,
	PROCESSING_END,
} from 'actions/process';

export const API_LEVEL = 'api';

/**
 * start, end pattern 可傳入形式
 *
 * 1. { pattern: <string | regex>, keyHandler: action => <string> }
 * 2. <string | regex>
 */
const startProcessPatterns = [
	{
		pattern: /^REQUEST_/,
		keyHandler: key => key.replace('REQUEST_', ''),
	},
];
const endProcessPatterns = [
	{
		pattern: /^RECIEVE_/,
		keyHandler: key => key.replace('RECIEVE_', ''),
	},
	{
		pattern: /^FAILURE_/,
		keyHandler: key => key.replace('FAILURE_', ''),
	},
];

/**
 * bypass pattern 可傳入形式只接受 <string | regex>
 */
const bypassPatterns = [PROCESSING_START, PROCESSING_END];

/**
 * 執行 pattern 的檢查
 */
const getValidator = entity => {
	let validator;
	if (typeof entity === 'string')
		validator = { item: entity, match: (item, target) => item === target };
	if (entity instanceof RegExp)
		validator = { item: entity, match: (item, target) => item.test(target) };

	return validator;
};
const hasMatchedPatterns = (patterns = [], target) => {
	for (let entity of patterns) {
		let validator;

		// pattern = <string | regex>
		validator = getValidator(entity);
		if (validator && validator.match(entity, target)) {
			return true;
		}

		// pattern = { pattern: <string | regex>, keyHandler: <fn> }
		validator = getValidator(entity.pattern);
		if (validator && validator.match(entity.pattern, target)) {
			const key =
				entity.keyHandler && typeof entity.keyHandler === 'function'
					? entity.keyHandler(target)
					: target;
			return key;
		}
	}
	return false;
};

/**
 * 監聽滿足 pattern 的非同步處理
 */
const processMiddleware = ({ getState }) => next => action => {
	// 忽略白名單
	if (hasMatchedPatterns(bypassPatterns, action.type)) {
		return next(action);
	}

	// 自動註冊、結束 process
	const sequence = [
		{
			patterns: startProcessPatterns,
			handler: processingStart,
		},
		{
			patterns: endProcessPatterns,
			handler: processingEnd,
		},
	];

	const isMatched = sequence.some(({ patterns, handler }) => {
		// boolean or string
		let result = hasMatchedPatterns(patterns, action.type);
		if (result) {
			const key = typeof result === 'string' ? result : action.type;
			next(action);
			next(handler(key, API_LEVEL));
			return true; // 提早跳出
		}
		return false;
	});

	if (isMatched) return;

	return next(action);
};

export default processMiddleware;
