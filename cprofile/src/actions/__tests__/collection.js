/* eslint-disable */
import {
	FETCH_MY_COLLECTION,
	fetchMyCollectionProcess,
	ADD_COLLECTION,
	addCollection,
	CANCEL_COLLECTION,
	cancelCollection,
	UPDATE_COLLECTION,
	updateCollection,
} from 'actions/collection';

describe('collection actions', () => {
	it('類目選單 JSON 存入 state', () => {
		const extendedState = '';
		const expectedAction = {
			type: FETCH_MY_COLLECTION,
			extendedState,
		};
		expect(fetchMyCollectionProcess(extendedState)).toEqual(expectedAction);
	});

	it('新增收藏', () => {
		const targetPid = 1001;
		const processId = 2002;
		const callback = () => null;
		const expectedAction = {
			type: ADD_COLLECTION,
			targetPid,
			processId,
			callback,
		};
		expect(addCollection(targetPid, processId, callback)).toEqual(
			expectedAction
		);
	});

	it('取消收藏', () => {
		const targetPid = 1001;
		const processId = 2002;
		const callback = () => null;
		const expectedAction = {
			type: CANCEL_COLLECTION,
			targetPid,
			processId,
			callback,
		};
		expect(cancelCollection(targetPid, processId, callback)).toEqual(
			expectedAction
		);
	});

	it('更新 collection 資料到 redux', () => {
		const payload = { id: 108190 };
		const expectedAction = {
			type: UPDATE_COLLECTION,
			payload,
		};
		expect(updateCollection(payload)).toEqual(expectedAction);
	});
});
