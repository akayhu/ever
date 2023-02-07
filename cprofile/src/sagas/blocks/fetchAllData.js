import {
	takeLatest,
	take,
	fork,
	cancel,
	put,
	select,
	all,
} from 'redux-saga/effects';
import { List } from 'immutable';
import {
	fetchAllDataProcessEnd,
	fetchAllDataProcessError,
	requestFetchBlockList,
	requestBlockData,
	RECIEVE_FETCH_BLOCK_LIST,
	FAILURE_FETCH_BLOCK_LIST,
	FETCH_ALL_DATA_PROCESS_START,
} from 'actions/blocks';
import {
	requestFetchProfileBasic,
	RECIEVE_FETCH_PROFILE_BASIC,
	FAILURE_FETCH_PROFILE_BASIC,
} from 'actions/blocks/basic';
import { processingStart, processingEnd } from 'actions/process';
import { INIT_CARD } from 'actions/ui/card';
import { hasPlusActivity } from 'actions/ui/plusActivity';
import { pushSystemMessage } from 'actions/ui/systemMessage';

/**
 * Watch Saga: 初始化完成後，接著取回整頁資料
 */
export function* watchFetchAllData() {
	yield takeLatest(FETCH_ALL_DATA_PROCESS_START, function*(action) {
		// 完成初始化流程
		const process = yield fork(fetchAllData, action);
		const error = yield take([FAILURE_FETCH_BLOCK_LIST]);
		yield cancel(process);
		yield put(fetchAllDataProcessError('取得區塊資料失敗', error));
	});
}

/**
 * Worker Saga
 * @param {*} action
 */
export function* fetchAllData(action) {
	let result = false;
	yield put(processingStart('fetchAllData'));
	try {
		const pid = yield action.pid ||
			select(state => state.getIn(['user', 'pid']));

		if (pid === -3) throw Error('invalid pid', pid);

		// 先判斷 basic 是否有資料，沒有就導 404 頁 (editor, profile)
		yield put(requestFetchProfileBasic({ pid }));
		const checkBasic = yield take([
			RECIEVE_FETCH_PROFILE_BASIC,
			FAILURE_FETCH_PROFILE_BASIC,
		]);

		// 個人頁出現 basic error 導 404
		if (checkBasic.error && /\/profile\/\d+/.test(window.location.pathname)) {
			const targetStatus = List([401, 403, 404]);
			return targetStatus.includes(checkBasic.payload.status)
				? (window.location.href = '/error/404')
				: (window.location.href = '/error/500');
		}

		// editor 頁出現 basic error 跳提示
		if (checkBasic.error && /\/editor/.test(window.location.pathname)) {
			yield put(pushSystemMessage('伺服器異常! 基本資料取得錯誤....', 'error'));
		}

		// 先取得區塊設定，再取得所有區塊資料
		yield put(requestFetchBlockList({ pid }));
		const res = yield take(RECIEVE_FETCH_BLOCK_LIST);
		const blocksConfig = res.payload;

		// REFACTOR: 想把 block action next 部分搬回來，但遇上 blockConfig 和 blockData mapping 順序不固定問題
		// 只能等到 processAPI 支援 custom dispatched FSAs 才能解
		// TODO: 確保取得所有第三方服務快照與授權狀態
		yield all([
			...blocksConfig.map(block =>
				put(
					requestBlockData(block.blockId, block.type, block.template, { pid })
				)
			),
		]);

		const blocks = yield all([...blocksConfig.map(() => take(INIT_CARD))]);
		const plusActivityBlock = blocks.filter(
			block => block.blockType === 'plus_activity'
		);

		// 如果此帳號沒有文章則編輯頁左側不顯示職涯社群文章入口
		if (
			plusActivityBlock &&
			plusActivityBlock[0] &&
			plusActivityBlock[0].payload.length > 0
		) {
			yield put(hasPlusActivity());
		}

		yield put(fetchAllDataProcessEnd());
		result = true;
	} catch (e) {
		console.error(e);
		yield put(fetchAllDataProcessError('取得區塊資料失敗', action, e));
	} finally {
		yield put(processingEnd('fetchAllData'));
	}
	return result;
}
