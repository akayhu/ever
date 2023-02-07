import { takeEvery, put } from 'redux-saga/effects';
import { RECIEVE_UPDATE_PROFILE_BASIC } from 'actions/blocks/basic';
import { processingStart, processingEnd } from 'actions/process';
import { updateUserData } from 'actions/user';

export function* watchUpdateUserData() {
	yield takeEvery(RECIEVE_UPDATE_PROFILE_BASIC, function*(action) {
		try {
			yield put(processingStart('watchUpdateUserData'));
			yield put(updateUserData(action.payload));
		} catch (e) {
			console.error(e);
		} finally {
			yield put(processingEnd('watchUpdateUserData'));
		}
	});
}
