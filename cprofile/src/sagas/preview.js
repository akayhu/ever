import { takeEvery, put, select, call } from 'redux-saga/effects';
import { accountProcess } from './user';
import { fetchAllData } from './blocks/fetchAllData';
import { INIT_PREVIEW } from 'actions/ui/preview';
// import { triggerSurvey } from 'actions/ui/survey';
import { stateMachineTransition } from 'actions/ui/statemachine';
import { processingStart, processingEnd } from 'actions/process';

export function* initPreview() {
	yield takeEvery(INIT_PREVIEW, function*(action) {
		try {
			yield put(processingStart('initPreview'));
			let { isLogin, isFetchAllData } = yield select(state => ({
				isLogin: state.getIn(['user', 'login']),
				isFetchAllData: state.get('data').size > 0,
			}));

			// 未登入，先跑一次登入流程，若仍未登入就導 404
			if (!isLogin) {
				const res = yield call(accountProcess);
				if (!res) throw Error('account process error');
			}

			const pid = yield select(state => state.getIn(['user', 'pid']));
			if (pid === -3) return (window.location.href = '/error/404');

			if (!isFetchAllData) {
				const res = yield call(fetchAllData, pid);
				if (!res) throw Error('fetchAllData process error');
			}

			// 更改 UI state
			yield put(
				stateMachineTransition('preview', 'SHOW_PREVIEW', action.extendedState)
			);
			// 紙張預覽觸發 nps 調查問卷
			// if (action.extendedState.device === 'paper') {
			// 	yield put(triggerSurvey());
			// }
			yield put();
		} catch (e) {
			yield put(
				stateMachineTransition(
					'preview',
					'INIT_PREVIEW_ERROR',
					action.extendedState
				)
			);
		} finally {
			yield put(processingEnd('initPreview'));
		}
	});
}
