/* eslint-disable */
import {
	UPDATE_IMPORT_SERVICE_STATUS,
	updateImportServiceStatus,
	IMPORT_PROCESS,
	importProcess,
} from 'actions/blocks/import';

describe('import actions', () => {
	it('更新 reducer 匯入服務狀態', () => {
		const serviceName = 'behance';
		const payload = {
			id: 108190,
		};
		const callback = {
			id: 108199,
		};
		const expectedAction = {
			type: UPDATE_IMPORT_SERVICE_STATUS,
			serviceName,
			payload,
			callback,
		};
		expect(updateImportServiceStatus(serviceName, payload, callback)).toEqual(
			expectedAction
		);
	});

	it('執行匯入程序', () => {
		const payload = {
			id: 108190,
		};
		const callback = {
			id: 108199,
		};
		const expectedAction = {
			type: IMPORT_PROCESS,
			payload,
			callback,
		};
		expect(importProcess(payload, callback)).toEqual(expectedAction);
	});
});
