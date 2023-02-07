export function lazyObject(...keys) {
	return keys.reduce((final, key) => ({...final, [key]: true}), {})
}

// 判斷是否為中文字
export function isChineseWord(str) {
	return /^[\u4E00-\u9FA5]+$/.test(str);
}

// 回傳object的key
export function getKeys(obj) {
	return Object.keys(obj);
}