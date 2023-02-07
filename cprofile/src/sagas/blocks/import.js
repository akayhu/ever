import { takeEvery, put } from 'redux-saga/effects';
import {
	RECIEVE_IMPORT_SERVICE_DETAIL,
	updateImportServiceStatus,
} from 'actions/blocks/import';
import { processingStart, processingEnd } from 'actions/process';

export function* importServiceDetail() {
	yield takeEvery(RECIEVE_IMPORT_SERVICE_DETAIL, function*(action) {
		try {
			yield put(processingStart('importServiceDetail'));
			yield put(
				updateImportServiceStatus(action.meta.serviceName, {
					rawData: action.payload,
				})
			);
		} catch (e) {
			console.error(e);
		} finally {
			yield put(processingEnd('importServiceDetail'));
		}
	});
}
