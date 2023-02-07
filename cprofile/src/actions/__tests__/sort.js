/* eslint-disable */
import { UPDATE_SORT_PROCESS, updateSortProcess } from 'actions/sort';

describe('sort actions', () => {
	it('執行更新 sort 的程序', () => {
		const sortType = 'BLOCK';
		const payload = {};
		const expectedAction = {
			type: UPDATE_SORT_PROCESS,
			sortType,
			payload,
		};
		expect(updateSortProcess(sortType, payload)).toEqual(expectedAction);
	});
});
