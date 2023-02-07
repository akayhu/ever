import { List, fromJS } from 'immutable';

/**
 * 轉換 query string 成 object data，複雜資料型態請使用 qs
 * getURLQuery('id=1&list=1,2,3') => { id: "1", list: "1,2,3" }
 * @param {string} query
 * @return {Object}
 */
export default function getURLQuery(
	query = window.location.search.substring(1)
) {
	const search = /([^&=]+)=?([^&]*)/g;
	let match;
	const decode = s => decodeURIComponent(s.replace(/\+/g, ' '));
	const urlParams = {};
	/* eslint-disable no-cond-assign */
	while ((match = search.exec(query.replace('?', ''))) !== null)
		urlParams[decode(match[1])] = decode(match[2]);
	/* eslint-enable no-cond-assign */
	return urlParams;
}

/**
 * 檢查是否有特定的 query string
 * @param {*} validName
 */
export const hasSpecificQueryString = (validName = List()) => {
	let query = getURLQuery();
	return fromJS(query).some((value, key) => validName.includes(key));
};
