import { delay } from 'redux-saga';
import { put, take, fork, call, race } from 'redux-saga/effects';
import { RSAA } from 'redux-api-middleware';
import { isValidRSAA, validateRSAA } from 'utils/validation';

// https://github.com/redux-saga/redux-saga/issues/589
export function* takeFirst(pattern, saga, ...args) {
	const task = yield fork(function*() {
		while (true) {
			const action = yield take(pattern);
			yield call(saga, ...args.concat(action));
		}
	});
	return task;
}

/**
 * 發送 API，加上 timeout 機制
 * @param {*} action
 * @param {*} payload
 */
export function* requestAPI(
	actionCreator,
	payload,
	timeoutSec = 10000,
	actionType
) {
	if (!isValidRSAA(actionCreator(payload)))
		throw Error(
			`[requestAPI] Invalid RSAA action: ${validateRSAA(
				actionCreator(payload)
			)}`
		);

	let actionTypeArr = '';
	if (actionType) actionTypeArr = Array.from(actionType);

	let waitActionTypes;
	if (actionType) {
		waitActionTypes = actionType.splice(1, 2);
	} else {
		waitActionTypes = actionCreator(payload)[RSAA].types.splice(1, 2);
	}

	yield put(actionCreator(payload, actionTypeArr));

	const { res, timeout } = yield race({
		res: take(waitActionTypes),
		timeout: delay(timeoutSec),
	});

	if (timeout) {
		console.error(res);
		throw Error('[requestAPI] execute API timeout.');
	}
	if (res.error || !res.payload) {
		console.error(res);
		throw Error('[requestAPI] execute API error.');
	}
	return res;
}
