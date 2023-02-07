import { takeEvery, takeLatest, put, select, call } from 'redux-saga/effects';
import {
	requestPublishProfile,
	requestFetchProfileSetting,
	requestUpdateProfileSetting,
	FETCH_PRIVACY_PROCESS,
	SET_PRIVACY_PROCESS,
	SWITCH_PRIVACY_PROCESS,
	validPrivacyTypes,
} from 'actions/profile';
import {
	START_PUBLISH_PROCESS,
	publishResultProcess,
} from 'actions/ui/publish';
import { stateMachineTransition } from 'actions/ui/statemachine';
import { processingStart, processingEnd } from 'actions/process';
import { pushSystemMessage } from 'actions/ui/systemMessage';
// import { triggerSurvey } from 'actions/ui/survey';
import { requestAPI } from './util';

// 發佈
export function* publishProcess() {
	yield takeEvery(START_PUBLISH_PROCESS, function*(action) {
		try {
			yield put(processingStart('publishProcess'));
			const pid = yield select(state => state.getIn(['user', 'pid'], -3));
			if (pid === -3) throw Error('Invalid pid in publishProcess');
			const requestPublish = yield call(requestAPI, requestPublishProfile, {
				pid,
			});
			// yield put(triggerSurvey()); // 發佈成功觸發 nps 調查問卷
			yield put(publishResultProcess(requestPublish.payload));
			yield put(
				stateMachineTransition(
					'publish',
					'PUBLISH_SUCCESS',
					action.extendedState
				)
			);
		} catch (e) {
			console.error(e);
			yield put(
				stateMachineTransition('publish', 'ERROR', action.extendedState)
			);
		} finally {
			yield put(processingEnd('publishProcess'));
		}
	});
}

// 取得資訊開放設定
export function* fetchPrivacyProcess() {
	yield takeLatest(FETCH_PRIVACY_PROCESS, function*() {
		try {
			yield put(processingStart('fetchPrivacyProcess'));
			const pid = yield select(state => state.getIn(['user', 'pid'], -3));
			if (pid === -3) throw Error('Invalid pid in fetchPrivacyProcess');
			yield call(requestAPI, requestFetchProfileSetting, { pid });
			yield put(stateMachineTransition('publish', 'LOAD_PRIVACY_SUCCESS'));
		} catch (e) {
			console.error(e);
			yield put(stateMachineTransition('publish', 'ERROR'));
		} finally {
			yield put(processingEnd('fetchPrivacyProcess'));
		}
	});
}

// TODO: 切換
export function* switchPrivacyProcess() {
	yield takeLatest(SWITCH_PRIVACY_PROCESS, function*(action) {
		try {
			yield put(processingStart('switchPrivacyProcess'));
			const type = yield select(state =>
				state.getIn(['profile', 'privacy', 'type'])
			);
			if (!validPrivacyTypes.includes(type))
				throw Error('Invalid type in switchPrivacyProcess', type);
			yield put(
				stateMachineTransition('privacy', 'SWITCH_PRIVACY', { privacy: type })
			);
		} catch (e) {
			console.error(e);
			yield put(stateMachineTransition('privacy', 'PRIVACY_ERROR'));
		} finally {
			yield put(processingEnd('switchPrivacyProcess'));
		}
	});
}

// 更新資訊開放設定
export function* setPrivacyProcess() {
	yield takeLatest(SET_PRIVACY_PROCESS, function*(action) {
		try {
			yield put(processingStart('setPrivacyProcess'));
			const { pid, type } = yield select(state => ({
				pid: state.getIn(['user', 'pid'], -3),
				type: state.getIn(['profile', 'privacy', 'type']),
			}));
			if (pid === -3) throw Error('Invalid pid in setPrivacyProcess');

			yield call(requestAPI, requestUpdateProfileSetting, { pid, type });

			if (type === 'PRIVATE') {
				// 停止公開個人頁
				yield put(stateMachineTransition('publish', 'UNPUBLISH_SUCCESS'));
				yield put(pushSystemMessage('已停止公開個人頁！', 'success'));
			} else {
				// 公開、連結分享設定切換
				yield put(stateMachineTransition('privacy', 'SET_PRIVACY_SUCCESS'));
				yield put(pushSystemMessage('更新個人頁分享設定成功！', 'success'));
			}
		} catch (e) {
			console.error(e);
			yield put(stateMachineTransition('privacy', 'PRIVACY_ERROR'));
			yield put(
				pushSystemMessage('更新分享設定時發生錯誤，請重新再試一次！', 'error')
			);
		} finally {
			yield put(processingEnd('setPrivacyProcess'));
		}
	});
}
