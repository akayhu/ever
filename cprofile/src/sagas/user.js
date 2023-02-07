import {
	takeEvery,
	put,
	take,
	select,
	fork,
	cancel,
	// all,
	// spawn,
	call,
} from 'redux-saga/effects';
import LogRocket from 'logrocket';
import generalConfig from 'config/general';
import {
	requestInitialProfile,
	accountProcessEnd,
	accountProcessError,
	requestLoginStatus,
	requestUserName,
	RECIEVE_LOGIN_STATUS,
	FAILURE_LOGIN_STATUS,
	ACCOUNT_PROCESS_START,
	initialProfileProcessEnd,
	initialProfileProcessError,
	INITIAL_PROFILE_PROCESS_START,
	RECIEVE_INITIAL_PROFILE,
	FAILURE_INITIAL_PROFILE,
	RECIEVE_USERNAME,
	FAILURE_USERNAME,
	USER_LOGIN,
	USER_LOGOUT,
} from 'actions/user';
import { openPreloginService } from 'actions/ui/activationGuide';
// import { connectPusher } from './pusher';
import { processingStart, processingEnd } from 'actions/process';
import { sendToDataLayer } from 'utils/gtmDataLayer';
import { isValidStage } from 'utils/validation';
import {
	requestFetchServiceLightbox,
	GET_RECIEVE_FETCH_SERVICE_LIGHTBOX,
} from 'actions/serviceInfo';
import { getExpireTime } from 'utils/time';
import { setCookieFunc } from 'utils/cookie';

/**
 * 檢查登入啟用資訊流程 (具冪等性，可重複呼叫)
 */
export function* watchAccountProcess() {
	yield takeEvery(ACCOUNT_PROCESS_START, function*(action) {
		// fork 另開 branch 執行 process
		const process = yield fork(accountProcess, action);

		// 若接收到這些 Error，取消 process
		const error = yield take([FAILURE_LOGIN_STATUS, FAILURE_USERNAME]);
		yield cancel(process);
		yield put(accountProcessError(error));
	});
}

export function* accountProcess(action) {
	let result = false;
	try {
		yield put(processingStart('accountProcess'));
		// 登入狀態
		const isLogin = yield select(state => state.getIn(['user', 'login']));
		// FIXME: 瓶頸點
		if (!isLogin) {
			// 原本這邊的 put(requestUserName() 取使用者名字，改為從取得登入狀態後 type = 2 或 3 再去取得使用者名字
			// 故 saga 多 watchLoginStatus 去監聽 RECIEVE_LOGIN_STATUS
			// 這邊則改為不監聽 RECIEVE_USERNAME
			yield put(requestLoginStatus());
			yield take([RECIEVE_LOGIN_STATUS, FAILURE_LOGIN_STATUS]);
		}

		const { pid /*, name*/ } = yield select(state => ({
			pid: state.getIn(['user', 'pid']),
			// name: state.getIn(['user', 'data', 'userName']),
		}));

		if (!pid || pid === -3) return;

		// Error Tracking & User Session Recording
		if (isValidStage(['lab', 'staging', 'production'])) {
			LogRocket.identify(pid, {});
			// global.drift.identify(pid, {
			// 	name,
			// });
		}

		// 建立 pusher 連線
		// yield spawn(connectPusher);
		yield put(accountProcessEnd());
		result = true;
	} catch (e) {
		console.error(e);
		yield put(accountProcessError(e));
	} finally {
		yield put(processingEnd('accountProcess'));

		// push to dataLayer
		const pid = yield select(state => state.getIn(['user', 'pid']));
		yield call(sendToDataLayer, { pid });
	}
	return result;
}

/**
 * 檢查登入狀態拿使用者名字
 * 檢查是否需要顯示服務條款 LB 並存 cookie
 */

function saveCookie() {
	let d = new Date();
	const toNightTime = d.getTime() + getExpireTime();
	d.setTime(d.getTime() + getExpireTime());
	setCookieFunc('brandMechanism', d.setTime(toNightTime), d.toGMTString(), '/');
}

export function* watchLoginStatus() {
	const brandMechanismCookie = window.brandMechanismCookie;
	yield takeEvery(RECIEVE_LOGIN_STATUS, function*(action) {
		try {
			yield put(processingStart('LoginStatus'));
			// type:2 已完成 AC 登入並且為有效狀態，但尚未啟用本產品。
			// type:3 已完成 AC 登入並且為有效狀態，並已啟用本產品。
			if (action.payload.type === 2 || action.payload.type === 3) {
				// 已登入狀態取使用者名字
				const pid = yield select(state => state.getIn(['user', 'pid']));
				yield put(requestUserName());
				yield take([RECIEVE_USERNAME, FAILURE_USERNAME]);

				/*
					首頁服務條款跳轉, 沒有 cookie 發 API 判斷要不要開 LB 
					如果要開 同時也發 action 打開前端的開關
				*/
				const pathName = window.location.pathname;
				if (action.payload.type === 2) return;

				if (
					pathName === '/editor' ||
					pathName === '/editor/loginFromPreLogin'
				) {
					yield put(requestFetchServiceLightbox({ pid }));
					yield take([GET_RECIEVE_FETCH_SERVICE_LIGHTBOX]);
				} else if (!brandMechanismCookie) {
					yield put(requestFetchServiceLightbox({ pid }));
					yield take([GET_RECIEVE_FETCH_SERVICE_LIGHTBOX]);
					const showEditorService = yield select(state =>
						state.getIn(['serviceInfo', 'showEditorService'])
					);
					if (showEditorService) yield put(openPreloginService());
					saveCookie();
				}
			} else {
				if (!brandMechanismCookie && action.payload.type !== 1) {
					yield put(openPreloginService());
					saveCookie();
				}
			}
		} catch (e) {
			console.error(e);
			yield put(accountProcessError(e));
		} finally {
			yield put(processingEnd('LoginStatus'));
		}
	});
}

/**
 * 導 AC 登入
 */
export function* watchLogin() {
	yield takeEvery(USER_LOGIN, function*(action) {
		const returnUrl = action.returnUrl || '/';
		const url = `${generalConfig.endpoints.login}${returnUrl}`;
		yield (window.location.href = url);
	});
}

/**
 * 導 AC 登出
 */
export function* watchLogout() {
	yield takeEvery(USER_LOGOUT, function*(action) {
		const returnUrl = action.returnUrl || '/';
		const url = `${generalConfig.endpoints.logout}${returnUrl}`;
		yield (window.location.href = url);
	});
}

/**
 * 啟用帳戶流程
 */
export function* watchInitialProfile() {
	yield takeEvery(INITIAL_PROFILE_PROCESS_START, function*(action) {
		try {
			yield put(processingStart('initialProfile'));

			const pid = yield select(state => state.getIn(['user', 'pid']));
			if (!pid || pid === -3) throw Error('帳號已登入且啟用，卻未取得 pid');

			// 啟用服務
			yield put(requestInitialProfile({ pid }));
			const res = yield take([
				RECIEVE_INITIAL_PROFILE,
				FAILURE_INITIAL_PROFILE,
			]);
			if (res.error) throw Error(res);
			yield put(initialProfileProcessEnd());
		} catch (e) {
			console.error(e);
			yield put(initialProfileProcessError(e));
		} finally {
			yield put(processingEnd('initialProfile'));
		}
	});
}
