import {isEqual, isObject, isArray} from 'lodash/lang';
import {has} from 'lodash/object';

// 用來記憶fn所傳入的參數(targets: Array, 參數的位置)，若相同則回傳上一次的結果
export function memorizeLast(fn, targets) {
	const memorized = function m(...args) {
		const lp = memorized.lastParameters;
		let different = false;

		// 第一次才會跑這段
		if (!memorized.runed) {
			memorized.runed = true;
			const keys = targets || [1];
			for (let i = 0; i < keys.length; i += 1)
				lp[i] = args[targets[i] - 1];

			const result = fn.apply(this, args);
			memorized.lastResult = result;
			return result;
		}

		//  判斷參數數值有沒有改變
		for (let i = 0; i < targets.length; i += 1) {
			if (!isEqual(lp[i], args[targets[i] - 1])) {
				lp[i] = args[targets[i] - 1];
				different = true;
			}
		}
		if (different) {
			const result = fn.apply(this, args);
			memorized.lastResult = result;
			return result;
		}
		return memorized.lastResult;
	};
	memorized.lastParameters = [];
	memorized.lastResult = null;
	memorized.runed = false;

	return memorized;
}

// 用來判斷後端回傳的API是否有錯誤
export function isWrong(obj) {
	if (obj === true || obj === false) return false;
	if (!obj) return true;
	if (!isObject(obj) && !isArray(obj)) return true;

	return (has(obj, 'errorCode') && obj.errorCode === 500) ||
		has(obj, 'error') ||
		has(obj, 'warning');
}
