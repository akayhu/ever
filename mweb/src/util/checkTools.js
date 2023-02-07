import {isObject, isArray} from 'lodash/lang';
import {has} from 'lodash/object';

// 用來確認action是否被此reducer處理
export function isActionForReducer({domain, key, action, falseKeys, trueKeys, passMap}) {
	if (!action.payload) return false;

	const actionsDomain = action.payload.domain;
	const actionsKey = action.payload.key;
	/**
	 * 比對key
	 * 若action.payload的key為all加上domain代表可同時修所有domain，用於RESET_LIST
	 */
	if (actionsKey === `all${actionsDomain}` || actionsKey === `all${actionsDomain}s`) return true;

	// 比對passMap
	if (passMap) {
		const keysForCheck = Object.keys(passMap);
		const isMatch = keysForCheck.every(key => (passMap[key].indexOf(action.payload[key]) !== -1));
		return isMatch;
	}

	// 比對domain
	if (actionsDomain !== domain) return false;

	// 比對key
	if (!key) {
		if (falseKeys) return falseKeys.indexOf(actionsKey) === -1;
		if (trueKeys) return trueKeys.indexOf(actionsKey) !== -1;
	}
	if (actionsKey !== key) return false;

	return true;
}

export function isWrong(obj) {
	if (obj === true || obj === false) return false;
	if (!obj) return true;
	if (!isObject(obj) && !isArray(obj)) return true;

	return (has(obj, 'errorCode') && obj.errorCode !== 0) ||
		has(obj, 'error') ||
		has(obj, 'warning');
}
