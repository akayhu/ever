/* eslint-disable */
import {
	FETCH_ALL_DATA_PROCESS_START,
	fetchAllDataProcessStart,
	FETCH_ALL_DATA_PROCESS_END,
	fetchAllDataProcessEnd,
	FETCH_ALL_DATA_PROCESS_ERROR,
	fetchAllDataProcessError,
	BLOCK_DATA_UPDATE_PROCESS_START,
	blockDataUpdateProcessStart,
	BLOCK_DATA_UPDATE_PROCESS_END,
	blockDataUpdateProcessEnd,
	BLOCK_DATA_UPDATE_PROCESS_ERROR,
	blockDataUpdateProcessError,
	VALIDATE_DATAMODEL_ERROR,
	validateDataModelError,
	BLOCK_SETTING_UPDATE_PROCESS_START,
	blockSettingUpdateProcessStart,
	BLOCK_SETTING_UPDATE_PROCESS_END,
	blockSettingUpdateProcessEnd,
	BLOCK_SETTING_UPDATE_PROCESS_ERROR,
	blockSettingUpdateProcessError,
	CHANGE_HOOK_PROCESS_STATUS,
	changeHookProcessStatus,
} from 'actions/blocks/index';

describe('index actions', () => {
	it('fetch All Data Process Start', () => {
		const pid = 108190;
		const expectedAction = {
			type: FETCH_ALL_DATA_PROCESS_START,
			pid,
		};
		expect(fetchAllDataProcessStart(pid)).toEqual(expectedAction);
	});

	it('fetch All Data Process End', () => {
		const pid = 108190;
		const expectedAction = {
			type: FETCH_ALL_DATA_PROCESS_END,
			pid,
		};
		expect(fetchAllDataProcessEnd(pid)).toEqual(expectedAction);
	});

	it('fetch All Data Process Error', () => {
		const pid = 108190;
		const msg = 'error';
		const error = 'error';
		const expectedAction = {
			type: FETCH_ALL_DATA_PROCESS_ERROR,
			pid,
			msg,
			error,
		};
		expect(fetchAllDataProcessError(pid, msg, error)).toEqual(expectedAction);
	});

	it('區塊更新流程', () => {
		const uniKey = 108190;
		const payload = {};
		const metadata = {};
		const hooks = {};
		const convertType = 'avatar';
		const expectedAction = {
			type: BLOCK_DATA_UPDATE_PROCESS_START,
			uniKey,
			payload,
			metadata,
			hooks,
			convertType,
		};
		expect(
			blockDataUpdateProcessStart(uniKey, payload, metadata, hooks, convertType)
		).toEqual(expectedAction);
	});

	it('區塊更新成功', () => {
		const uniKey = 108190;
		const expectedAction = {
			type: BLOCK_DATA_UPDATE_PROCESS_END,
			uniKey,
		};
		expect(blockDataUpdateProcessEnd(uniKey)).toEqual(expectedAction);
	});

	it('區塊更新失敗', () => {
		const uniKey = '';
		const error = 'error';
		const expectedAction = {
			type: BLOCK_DATA_UPDATE_PROCESS_ERROR,
			uniKey,
			error,
		};
		expect(blockDataUpdateProcessError(uniKey, error)).toEqual(expectedAction);
	});

	it('驗證 data model 失敗', () => {
		const name = '';
		const input = '';
		const error = 'error';
		const expectedAction = {
			type: VALIDATE_DATAMODEL_ERROR,
			name,
			input,
			error,
		};
		expect(validateDataModelError(name, input, error)).toEqual(expectedAction);
	});

	it('開始更新 Block API', () => {
		const uniKey = 108190;
		const expectedAction = {
			type: BLOCK_SETTING_UPDATE_PROCESS_START,
			uniKey,
		};
		expect(blockSettingUpdateProcessStart(uniKey)).toEqual(expectedAction);
	});

	it('更新 Block API 成功', () => {
		const uniKey = 108190;
		const expectedAction = {
			type: BLOCK_SETTING_UPDATE_PROCESS_END,
			uniKey,
		};
		expect(blockSettingUpdateProcessEnd(uniKey)).toEqual(expectedAction);
	});

	it('更新 Block API 失敗', () => {
		const uniKey = 108190;
		const error = 'error';
		const expectedAction = {
			type: BLOCK_SETTING_UPDATE_PROCESS_ERROR,
			uniKey,
			error,
		};
		expect(blockSettingUpdateProcessError(uniKey, error)).toEqual(
			expectedAction
		);
	});

	it('hook 非同步處理的狀態變更', () => {
		const hookname = '經歷';
		const status = true;
		const expectedAction = {
			type: CHANGE_HOOK_PROCESS_STATUS,
			hookname,
			status,
		};
		expect(changeHookProcessStatus(hookname, status)).toEqual(expectedAction);
	});
});
