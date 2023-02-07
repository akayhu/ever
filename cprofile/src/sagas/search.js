import { put, take, select, takeEvery } from 'redux-saga/effects';
import {
	requestFetchSearchProfileList,
	SUBMIT_SEARCH_QUERY,
	RECIEVE_SEARCH_PROFILE_LIST,
	FAILURE_SEARCH_PROFILE_LIST,
} from 'actions/profile';
import { processingStart, processingEnd } from 'actions/process';

export function* watchSearch() {
	yield takeEvery(SUBMIT_SEARCH_QUERY, function*(action) {
		yield put(processingStart('search'));
		try {
			const param = yield select(state => ({
				query: state.getIn(['ui', 'profile', 'search', 'keyword']),
				offset: state.getIn(['ui', 'profile', 'search', 'offset']),
				limit: 10,
			}));

			yield put(requestFetchSearchProfileList(param));
			const result = yield take([
				RECIEVE_SEARCH_PROFILE_LIST,
				FAILURE_SEARCH_PROFILE_LIST,
			]);
			if (result.error) throw Error(result);
		} catch (e) {
			console.error(e);
		} finally {
			yield put(processingEnd('search'));
		}
	});
}
