import {
	takeEvery,
	take,
	fork,
	cancel,
	put,
	select,
	call,
	all,
} from 'redux-saga/effects';
import nameMap from 'config/nameMap';
import { fromJS } from 'immutable';
import { updateCard, transTempIdToUID } from 'actions/ui/card';
import {
	BLOCK_DATA_UPDATE_PROCESS_START,
	blockDataUpdateProcessEnd,
	blockDataUpdateProcessError,
	CHANGE_HOOK_PROCESS_STATUS,
} from 'actions/blocks';
import { updateSortProcess } from 'actions/sort';
import { processingStart, processingEnd } from 'actions/process';

let tasks = fromJS({});

/**
 * Watch Saga
 */
export function* watchBlockUpdater() {
	yield takeEvery(BLOCK_DATA_UPDATE_PROCESS_START, function*(action) {
		const { uniKey, payload, convertType } = action;
		const { index, keyPath, value, multiFeildsUpdate } = payload;

		try {
			const param = yield select(state => {
				const blockType = state.getIn(['config', uniKey, 'blockType']);
				const config = nameMap[blockType];
				return {
					...config,
					blockType,
					pid: state.getIn(['user', 'pid']),
					processId: config.multiRecords
						? state.getIn(['data', uniKey, index, config.uidName])
						: uniKey,
					taskKeyPath: config.multiRecords
						? [uniKey, state.getIn(['data', uniKey, index, config.uidName])]
						: [uniKey],
					convertType,
				};
			});

			// 是否真的要更新資料
			const isNeedUpdate = yield call(
				handleShouldUpdateData,
				action.hooks,
				param.blockType,
				action.uniKey,
				action
			);
			if (!isNeedUpdate) {
				yield put(blockDataUpdateProcessEnd(action.uniKey));
				return;
			}

			// 無論如何先更新 store 目前狀態
			if (multiFeildsUpdate) {
				// 多筆欄位更新: value = { 欄位1: value1, 欄位2: value2 }, keyPath = [uniKey, (index)]
				const feilds = Object.keys(value);
				yield all([
					...feilds.map(feild =>
						put(updateCard(uniKey, value[feild], [...keyPath, feild]))
					),
				]);
			} else {
				// 單筆欄位更新
				yield put(updateCard(uniKey, value, keyPath));
			}

			// API 更新程序，每個 id 更新是 debounce 1 秒
			//   - 單筆資料區塊: { blockId: <TASK> }
			//   - 多筆資料區塊: { blockId: { uid: <TASK> } }
			if (tasks.hasIn(param.taskKeyPath)) {
				yield cancel(tasks.getIn(param.taskKeyPath));
			}
			tasks = tasks.setIn(
				param.taskKeyPath,
				yield fork(blockUpdater, action, param)
			);
			console.log(
				`[updater] start | id: ${param.processId} | tasks:`,
				tasks.toJS()
			);
		} catch (e) {
			console.error(e);
		}
	});
}

/**
 * API 更新
 */
export function* blockUpdater(action, param) {
	const { uniKey, metadata, payload, hooks } = action;
	const { updater } = metadata;
	const { pid, blockType, convertType } = param;
	const dataModel = yield select(state =>
		param.multiRecords
			? state.getIn(['data', uniKey, payload.index])
			: state.getIn(['data', uniKey])
	);

	yield put(processingStart(param.processId));
	console.log(
		`[updater] process | id: ${param.processId} | tasks:`,
		tasks.toJS()
	);

	try {
		// TODO 還沒有想到很好的方法去過濾暫時的圖片（base64），先強制濾掉
		if (
			payload.value &&
			Array.isArray(payload.value) &&
			payload.value.indexOf('data:image') >= 0
		)
			return false;

		// update data (id 不為 tmpId / 只有 update 口的 basic)
		if (
			action.uniKey === 'basic' ||
			!/tmp-/.test(dataModel.get(param.uidName))
		) {
			yield put(
				action.metadata.updater.update({
					...dataModel.toJS(),
					pid,
					convertType,
				})
			);
			const result = yield take([
				...updater.successConsts,
				...updater.failConsts,
			]);

			// 根據區塊 data API 結果處理 hook
			yield call(handleResultHook, blockType, uniKey, hooks, result);

			if (result.error) throw Error(result);
			yield put(blockDataUpdateProcessEnd(uniKey));
			return;
		}

		// 新增資料
		yield put(
			updater.create({
				...dataModel.toJS(),
				pid,
				[param.uidName]: null,
				convertType,
			})
		);

		let result = yield take([...updater.successConsts, ...updater.failConsts]);

		if (result.error) {
			// 處理失敗結果 hook
			yield call(handleResultHook, blockType, uniKey, hooks, result);
			throw Error(result);
		}

		// 暫時 id 換成真 id
		const tmpId = dataModel.get(param.uidName);
		const newUID = result.payload;
		yield put(transTempIdToUID(blockType, uniKey, tmpId, newUID));

		// 若需要更新 sort，另外呼叫不管結果
		if (param.sortType) yield put(updateSortProcess(blockType, uniKey));

		// 處理成功結果 hook
		yield call(handleResultHook, blockType, uniKey, hooks, result);
		yield put(blockDataUpdateProcessEnd(uniKey));
	} catch (e) {
		console.error(e);
		yield put(blockDataUpdateProcessError(action.uniKey, e));
	} finally {
		yield put(processingEnd(param.processId));
		tasks = tasks.deleteIn(param.taskKeyPath);
		console.log(
			`[updater] done | id: ${param.processId} | tasks:`,
			tasks.toJS()
		);

		// block 完成所有更新後執行 hook
		if (
			(param.multiRecords && tasks.get(uniKey, fromJS({})).size === 0) ||
			!param.multiRecords
		) {
			tasks = tasks.delete(uniKey);
			console.log(
				`[updater] block all done | id: ${uniKey} | tasks:`,
				tasks.toJS()
			);
			if (hooks.blockFinishUpdate) {
				yield call(hooks.blockFinishUpdate, blockType, uniKey);
			}
		}
	}
}

/**
 * 處理 hook，實際發送 request 前還可以自己決定要不要發
 */
export function* handleShouldUpdateData(hooks, blockType, uniKey, action) {
	const shouldUpdateData = (hooks && hooks.shouldUpdateData) || null;
	if (typeof shouldUpdateData !== 'function' && shouldUpdateData !== null) {
		console.error(
			`BlockWrapper's shouldUpdateData must to be function, find `,
			shouldUpdateData
		);
		return false;
	}
	// 沒有設定 shouldUpdateData 視為 pass
	if (!shouldUpdateData) return false;

	// 根據處理狀態回傳結果
	const status = yield call(shouldUpdateData, blockType, uniKey, action);
	switch (status) {
		case 'continue':
			return true;
		case 'bailout':
			return false;
		case 'pending': {
			const { status } = yield take(
				action =>
					action.type === CHANGE_HOOK_PROCESS_STATUS &&
					action.hookname === 'shouldUpdateData'
			);
			if (status === 'continue') return true;
			if (status === 'bailout') return false;

			console.error(
				`shouldUpdateData change status must be either continue or bailout, find `,
				status
			);
			return false;
		}

		default:
			console.error('invalid status in handleShouldUpdateData', status);
			return false;
	}
}

/**
 * 處理更新流程結果的 hook
 */
export const handleResultHook = (blockType, uniKey, hooks, result) => {
	const hookName = result.error ? 'updateError' : 'updateSuccess';
	const hookHandler = (hooks && hooks[hookName]) || null;

	// 沒有設定 hook 時視為 pass
	if (!hooks) return;
	if (!hookHandler) return;
	if (typeof hookHandler !== 'function' && hookHandler !== null) {
		console.error(
			`handleHook's ${hookName} must to be function, find `,
			hookHandler
		);
		return;
	}
	return hookHandler(blockType, uniKey, result.payload);
};
