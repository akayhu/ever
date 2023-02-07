import { takeEvery, put, select, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { accountProcess } from './user';
import { stateMachineTransition } from 'actions/ui/statemachine';
import { login } from 'actions/user';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import { processingStart, processingEnd } from 'actions/process';
import {
	updateCollection,
	requestCollectionList,
	requestAddCollection,
	requestCancelCollection,
	FETCH_MY_COLLECTION,
	ADD_COLLECTION,
	CANCEL_COLLECTION,
} from 'actions/collection';
import { requestAPI } from './util';

// 取得我的收藏
export function* fetchMyCollection() {
	yield takeEvery(FETCH_MY_COLLECTION, function*(action) {
		try {
			yield put(processingStart('fetchMyCollection'));
			// 檢查登入啟用狀態 REFACTOR: 寫成一隻 filter
			yield call(accountProcess);

			const { pid, isLogin, isInitial } = yield select(state => ({
				pid: state.getIn(['user', 'pid']),
				isInitial: state.getIn(['user', 'initial']),
				isLogin: state.getIn(['user', 'login']),
			}));

			if (pid === -3 || !isLogin) return yield put(login('/collection'));
			if (!isInitial) return (window.location.href = '/error/404');

			// 發 API
			const res = yield call(requestAPI, requestCollectionList, { pid });

			// 資料存到 redux store
			const collections = res.payload;
			yield put(updateCollection(collections));

			// 更改 UI state
			collections && collections.length > 0
				? yield put(
						stateMachineTransition(
							'collection',
							'SHOW_LIST',
							action.extendedState
						)
				  )
				: yield put(
						stateMachineTransition(
							'collection',
							'SHOW_EMPTY',
							action.extendedState
						)
				  );
		} catch (e) {
			console.error(e);
			yield put(
				stateMachineTransition('collection', 'ERROR', action.extendedState)
			);
		} finally {
			yield put(processingEnd('fetchMyCollection'));
		}
	});
}

// 切換新增、取消收藏
export function* toggleCollection() {
	yield takeEvery([ADD_COLLECTION, CANCEL_COLLECTION], function*(action) {
		const { targetPid, type, processId, callback } = action;
		const api = {
			ADD_COLLECTION: {
				action: requestAddCollection,
				text: '收藏',
			},
			CANCEL_COLLECTION: {
				action: requestCancelCollection,
				text: '取消收藏',
			},
		};

		try {
			yield delay(1000);
			yield put(processingStart(processId, 'toggleCollection'));

			yield call(accountProcess);

			const { pid, isLogin } = yield select(state => ({
				pid: state.getIn(['user', 'pid']),
				isLogin: state.getIn(['user', 'login']),
			}));

			if (typeof targetPid !== 'number' || targetPid === -3)
				throw Error(`Invalid targetPid: ${targetPid}, myPid: ${pid}`);

			if (pid === -3 || !isLogin)
				return yield put(login(`/profile/${targetPid}`));

			if (targetPid === pid)
				throw Error(
					`Cannot collect yourself! targetPid: ${targetPid}, myPid: ${pid}`
				);

			// 切換收藏狀態
			yield call(requestAPI, api[type].action, { pid, targetPid });
			yield put(pushSystemMessage(`${api[type].text}成功`, 'info'));

			// 執行 callback
			yield call(callback);
		} catch (e) {
			console.error(e);
			yield put(pushSystemMessage(`${api[type].text}失敗`, 'error'));
		} finally {
			yield put(processingEnd(processId, 'toggleCollection'));
		}
	});
}
