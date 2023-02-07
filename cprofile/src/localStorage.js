// https://developer.mozilla.org/en-US/docs/Web/API/Storage

const APPLICATION_IDENTIFY = '104Plus';
const convertKeyPathToName = (keyPath = []) => {
	try {
		if (!Array.isArray(keyPath)) throw Error('Keypath must be array.', keyPath);
		const hasInvalidSegment = keyPath.some(segment => {
			if (typeof segment !== 'string' && typeof segment !== 'number')
				return true;
			if (typeof segment === 'number' && !Number.isInteger(segment))
				return true;
			return false;
		});
		if (hasInvalidSegment)
			throw Error('Must only contain string or integer in keypath', keyPath);
		keyPath.unshift(APPLICATION_IDENTIFY);
		return keyPath.join('.');
	} catch (err) {
		console.error(err);
		return false;
	}
};

const persistState = {
	// 初始化，使用 cookie polyfill
	// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
	init() {
		if (!window.localStorage) {
			console.log('Init localStorage with polyfill.');
			Object.defineProperty(
				window,
				'localStorage',
				new function() {
					var aKeys = [],
						oStorage = {};
					Object.defineProperty(oStorage, 'getItem', {
						value: function(sKey) {
							return this[sKey] ? this[sKey] : null;
						},
						writable: false,
						configurable: false,
						enumerable: false,
					});
					Object.defineProperty(oStorage, 'key', {
						value: function(nKeyId) {
							return aKeys[nKeyId];
						},
						writable: false,
						configurable: false,
						enumerable: false,
					});
					Object.defineProperty(oStorage, 'setItem', {
						value: function(sKey, sValue) {
							if (!sKey) {
								return;
							}
							document.cookie =
								escape(sKey) +
								'=' +
								escape(sValue) +
								'; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';
						},
						writable: false,
						configurable: false,
						enumerable: false,
					});
					Object.defineProperty(oStorage, 'length', {
						get: function() {
							return aKeys.length;
						},
						configurable: false,
						enumerable: false,
					});
					Object.defineProperty(oStorage, 'removeItem', {
						value: function(sKey) {
							if (!sKey) {
								return;
							}
							document.cookie =
								escape(sKey) +
								'=; expires=Thu, 01 Jan 1911 00:00:00 GMT; path=/';
						},
						writable: false,
						configurable: false,
						enumerable: false,
					});
					Object.defineProperty(oStorage, 'clear', {
						value: function() {
							if (!aKeys.length) {
								return;
							}
							for (var sKey in oStorage) {
								document.cookie =
									escape(sKey) +
									'=; expires=Thu, 01 Jan 1911 00:00:00 GMT; path=/';
							}
						},
						writable: false,
						configurable: false,
						enumerable: false,
					});
					this.get = function() {
						var iThisIndx;
						for (var sKey in oStorage) {
							iThisIndx = aKeys.indexOf(sKey);
							if (iThisIndx === -1) {
								oStorage.setItem(sKey, oStorage[sKey]);
							} else {
								aKeys.splice(iThisIndx, 1);
							}
							delete oStorage[sKey];
						}
						for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
							oStorage.removeItem(aKeys[0]);
						}
						for (
							var aCouple,
								iKey,
								nIdx = 0,
								aCouples = document.cookie.split(/\s*;\s*/);
							nIdx < aCouples.length;
							nIdx++
						) {
							aCouple = aCouples[nIdx].split(/\s*=\s*/);
							if (aCouple.length > 1) {
								oStorage[(iKey = unescape(aCouple[0]))] = unescape(aCouple[1]);
								aKeys.push(iKey);
							}
						}
						return oStorage;
					};
					this.configurable = false;
					this.enumerable = true;
				}()
			);
		}
	},

	// 讀取資料
	loadState(key) {
		try {
			if (!key || (typeof key !== 'string' && !Array.isArray(key))) {
				throw Error('Invalid key in loadState', key);
			}
			const keyName = Array.isArray(key)
				? convertKeyPathToName(key)
				: `${APPLICATION_IDENTIFY}.${key}`;
			const serializedState = localStorage.getItem(keyName);
			if (serializedState === null) return;
			return JSON.parse(serializedState);
		} catch (err) {
			console.error(err);
			return;
		}
	},

	// 儲存資料
	saveState(key, state) {
		try {
			if (!key || (typeof key !== 'string' && !Array.isArray(key)))
				throw Error('Invalid key in saveState', key);
			const keyName = Array.isArray(key)
				? convertKeyPathToName(key)
				: `${APPLICATION_IDENTIFY}.${key}`;
			const serializedState =
				typeof state === 'string' ? state : JSON.stringify(state);
			localStorage.setItem(keyName, serializedState);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},

	// 清除指定資料
	deleteState(key) {
		try {
			if (!key || (typeof key !== 'string' && !Array.isArray(key)))
				throw Error('Invalid key in deleteState', key);
			const keyName = Array.isArray(key)
				? convertKeyPathToName(key)
				: `${APPLICATION_IDENTIFY}.${key}`;
			localStorage.removeItem(keyName);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	},
};

export default persistState;
