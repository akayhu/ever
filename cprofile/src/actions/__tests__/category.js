/* eslint-disable */
import { SAVE_CATEGORY_JSON, saveCategoryJSON } from 'actions/category';

describe('category actions', () => {
	it('類目選單 JSON 存入 state', () => {
		const category = 'Indust';
		const payload = {
			id: 7533967,
		};
		const expectedAction = {
			type: SAVE_CATEGORY_JSON,
			category,
			payload,
		};
		expect(saveCategoryJSON(category, payload)).toEqual(expectedAction);
	});
});
