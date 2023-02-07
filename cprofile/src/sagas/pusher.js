import { takeEvery, put, select, take, race, call } from 'redux-saga/effects';
import { requestFetchConnectorRawData } from 'actions/blocks/connector';
import { lightboxOpen } from 'actions/ui/lightbox';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import {
	PusherConnectAction,
	PusherConnectionErrorAction,
	PusherDisconnectAction,
	PUSHER_CONNECT_SUCCESS,
	PUSHER_CONNECT_ERROR,
	PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
	PUSHER_SUBSCRIBE_CHANNEL_ERROR,
	PUSHER_MESSAGE_RECEIVED,
	PUSHER_DISCONNECT,
} from 'actions/pusher';
import { delay } from '../../node_modules/redux-saga';
import { sendToDataLayer } from 'utils/gtmDataLayer';
import generalConfig from 'config/general';
import { processingStart, processingEnd } from 'actions/process';

// connector 接到 github oauth 結果
export function* watchPusherMessage() {
	yield takeEvery(PUSHER_MESSAGE_RECEIVED, function*(action) {
		yield put(processingStart('recievePusherMessage'));
		const pid = yield select(state => state.getIn(['user', 'pid']));
		if (action.msg) {
			// REFACTOR: github 收到 pusher 訊息代表有 token
			yield call(sendToDataLayer, { githubConnect: true }); // true 代表已授權
			yield put(requestFetchConnectorRawData('github', { pid }));
			yield put(lightboxOpen());
		}
		yield put(processingEnd('recievePusherMessage'));
	});
}

// 建立 pusher 連線
export function* connectPusher() {
	try {
		yield put(processingStart('connectPusher'));
		// initial, pending, success, error
		const pusherStatus = yield select(state => state.getIn(['user', 'pusher']));
		if (pusherStatus === 'pending' || pusherStatus === 'success') return;

		yield put(
			PusherConnectAction({
				key: generalConfig.pusher.key,
				options: {
					cluster: generalConfig.pusher.cluster,
					authEndpoint: generalConfig.endpoints.pusher,
					encrypted: true,
				},
			})
		);

		const { error, timeout } = yield race({
			success: call(function*() {
				yield take(PUSHER_CONNECT_SUCCESS);
				yield take(PUSHER_SUBSCRIBE_CHANNEL_SUCCESS);
			}),
			error: take([PUSHER_CONNECT_ERROR, PUSHER_SUBSCRIBE_CHANNEL_ERROR]),
			timeout: delay(10000),
		});
		if (error) throw Error('Pusher 連線錯誤', error);
		if (timeout) {
			yield put(PusherConnectionErrorAction('Pusher 連線逾時'));
			throw Error('Pusher 連線逾時', timeout);
		}
	} catch (e) {
		console.error(e);
		yield put(PusherDisconnectAction());
	} finally {
		yield put(processingEnd('connectPusher'));
	}
}

// 偵測到連線錯誤，提醒使用者重整
export function* watchPusherDisconnect() {
	yield take(PUSHER_DISCONNECT);
	yield put(pushSystemMessage('連線中斷，請試著重新整理頁面', 'error', false));
}
