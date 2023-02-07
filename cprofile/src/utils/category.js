/**
 * 將類目選單扁平化成陣列
 * @param {*} rawData
 * @param {*} childFieldName
 */
export const flatCategoryJSON = (rawData = [], childFieldName = 'n') => {
	let queue = rawData.slice();
	let result = [];

	while (queue.length > 0) {
		const item = queue.shift();
		if (typeof item !== 'object') continue;
		if (item.hasOwnProperty(childFieldName)) {
			queue = queue.concat(item.n);
			item.n = undefined;
		}
		result.push(item);
	}

	return result.sort((a, b) => a.no > b.no);
};

/**
 * 用編號找類目選項
 */
export const getItemByNo = (list = [], targetNo) => {
	if (!targetNo || !['string', 'number'].includes(typeof targetNo)) return {};
	return list.find(item => item.no === targetNo) || {};
};
