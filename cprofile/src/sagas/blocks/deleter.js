import { takeEvery, take, fork, cancel, put, select } from 'redux-saga/effects';
// import { delay } from 'redux-saga';
import { fromJS } from 'immutable';
import Ajv from 'ajv';
import nameMap from 'config/nameMap';
import { DELETE_BLOCK_ELEM } from 'actions/ui/card';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import { processingStart, processingEnd } from 'actions/process';
import { validateDataModelError } from 'actions/blocks';

const ajv = new Ajv();
let tasks = fromJS({});

/**
 * Watch Saga: 單筆資料段的刪除
 */
export function* watchBlockElemDeleter() {
	yield takeEvery(DELETE_BLOCK_ELEM, function*(action) {
		const { blockType, uniKey, uid } = action;
		try {
			const taskKeyPath = nameMap[blockType].multiRecords
				? [uniKey, uid]
				: [uniKey];

			// API 刪除程序
			//   - 單筆資料區塊: { blockId: <TASK> }
			//   - 多筆資料區塊: { blockId: { uid: <TASK> } }
			if (tasks.hasIn(taskKeyPath)) {
				yield cancel(tasks.getIn(taskKeyPath));
			}

			const process = yield fork(blockElemDeleter, action, taskKeyPath);
			tasks = tasks.setIn(taskKeyPath, process);
			console.log(`[deleter] start | id: ${uid} | tasks:`, tasks.toJS());
		} catch (e) {
			console.error(e);
			yield put(pushSystemMessage('刪除資料段失敗', 'error'));
		}
	});
}

/**
 * Worker Saga: 單筆資料段的刪除
 * @param {object} action
 */
export function* blockElemDeleter(action, taskKeyPath) {
	const { blockType, uid, uniKey } = action;
	const { metadata, multiRecords, uidName } = nameMap[blockType];
	const { deleter } = metadata;
	try {
		// 每個 id 刪除 debounce 1 秒
		yield put(processingStart(uniKey));

		const pid = yield select(state => state.getIn(['user', 'pid']));

		// 驗證 action 格式
		const checkAction = yield actionValidator(action);
		if (!checkAction) {
			throw Error('Invalid action', action);
		}

		// 只處理多筆資料區塊
		if (!multiRecords || !metadata.deleter || !uidName || !metadata) return;

		// 暫存的資料段不處理 API
		if (/tmp-/.test(uid)) return;

		yield put(deleter.delete({ pid, [uidName]: uid }));
		const result = yield take([
			...deleter.successConsts,
			...deleter.failConsts,
		]);

		if (result.error) throw Error(result);
	} catch (e) {
		console.error(e);
		yield put(pushSystemMessage('刪除資料段失敗', 'error'));
	} finally {
		yield put(processingEnd(action.uniKey));
		tasks = tasks.deleteIn(taskKeyPath);
		console.log(`[deleter] done | id: ${uid} | tasks:`, tasks.toJS());
		if (
			(multiRecords && tasks.get(uniKey, fromJS({})).size === 0) ||
			!multiRecords
		) {
			tasks = tasks.delete(uniKey);
			console.log(
				`[deleter] block all done | id: ${uniKey} | tasks:`,
				tasks.toJS()
			);
		}
	}
}

/**
 * 驗證 action payload 的選項是否合法
 */
export function* actionValidator(action) {
	const actionSchema = {
		type: 'object',
		required: ['type', 'uniKey', 'blockType', 'uid'],
		properties: {
			type: {
				type: 'string',
				pattern: DELETE_BLOCK_ELEM,
			},
			blockType: {
				type: 'string',
				pattern:
					'(basic|experience|education|honor|talent|gallery|github|behance|custom|plus_activity)',
			},
			uniKey: {
				type: 'string',
			},
			uid: {
				oneOf: [
					{
						type: 'string',
					},
					{
						type: 'number',
					},
				],
			},
		},
	};

	// 檢查 schema 格式 & 驗證 data model
	const result =
		ajv.validateSchema(actionSchema) && ajv.validate(actionSchema, action);
	if (!result) {
		console.error(ajv.errorsText());
		yield put(validateDataModelError('deleter action', action, ajv.errors));
	}
	return result;
}
