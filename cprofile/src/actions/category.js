import { RSAA } from 'redux-api-middleware';
import { validCategory, getCategoryJSONUrl } from 'config/category';

/**
 * [API] 取類目選單JSON Data
 * @param {*} param
 */
export const REQUEST_FETCH_CATEGORY_JSON = 'REQUEST_FETCH_CATEGORY_JSON';
export const RECIEVE_FETCH_CATEGORY_JSON = 'RECIEVE_FETCH_CATEGORY_JSON';
export const FAILURE_FETCH_CATEGORY_JSON = 'FAILURE_FETCH_CATEGORY_JSON';
export const requestFetchCategoryJSON = param => {
	return {
		[RSAA]: {
			endpoint: getCategoryJSONUrl(param.dataSource),
			types: [
				REQUEST_FETCH_CATEGORY_JSON,
				RECIEVE_FETCH_CATEGORY_JSON,
				FAILURE_FETCH_CATEGORY_JSON,
			],
			method: 'GET',
			next: (response, json) => saveCategoryJSON(param.dataSource, json),
			bailout: () => {
				if (validCategory.includes(param.dataSource)) return false;
				console.error('Invalid category: ', param);
				return true;
			},
		},
	};
};

/**
 * 類目選單 JSON 存入 state
 */
export const SAVE_CATEGORY_JSON = 'SAVE_CATEGORY_JSON';
export const saveCategoryJSON = (category, payload) => ({
	type: SAVE_CATEGORY_JSON,
	category,
	payload,
});
