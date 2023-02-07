import { fromJS } from 'immutable';
import { takeEvery, put, select, call, all } from 'redux-saga/effects';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import nameMap from 'config/nameMap';
import {
	validServiceName,
	IMPORT_PROCESS,
	requestImportBlocks,
} from 'actions/blocks/import';
import { processingStart, processingEnd } from 'actions/process';
import { requestAPI } from './util';
const blockConfig = fromJS(nameMap);

export function* importProcess() {
	yield takeEvery(IMPORT_PROCESS, function*(action) {
		try {
			yield put(processingStart('importProcess'));
			const pid = yield select(state => state.getIn(['user', 'pid']));
			const { serviceName, selectedBlocks } = action.payload;

			if (pid === -3) throw Error('Invalid pid in importProcess');
			if (!serviceName || !validServiceName.includes(serviceName))
				throw Error('Invalid selected service in importProcess');
			if (!selectedBlocks)
				throw Error('Invalid selected blocks in importProcess');

			const res = yield call(
				requestAPI,
				requestImportBlocks,
				{ pid, serviceName, selectedBlocks },
				30000
			);

			// 如果匯入的區塊有錯，發出錯誤提示
			const errorBlocks = res.payload
				.filter(block => !block.success)
				.map(block =>
					put(
						pushSystemMessage(
							`${blockConfig.getIn([block.type, 'name'])} 區塊匯入資料失敗!`,
							'error'
						)
					)
				);
			if (errorBlocks.length > 0) yield all(errorBlocks);
		} catch (e) {
			console.error(e);
		} finally {
			yield put(processingEnd('importProcess'));
			// 不論成功與否，執行結束的 cb
			if (typeof action.callback === 'function') {
				yield call(action.callback);
			}
		}
	});
}
