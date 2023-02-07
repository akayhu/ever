import { put, take, select, takeLatest } from 'redux-saga/effects';
import { Map } from 'immutable';
// import { delay } from 'redux-saga';
import {
	ADD_CARD,
	ARCHIVE_CARD,
	CHANGE_THEME,
	CHANGE_TEMPLATE,
	SAVE_MASK,
} from 'actions/ui/card';
import {
	requestCreateBlock,
	requestUpdateBlock,
	RECIEVE_CREATE_BLOCK,
	FAILURE_CREATE_BLOCK,
	RECIEVE_UPDATE_BLOCK,
	FAILURE_UPDATE_BLOCK,
} from 'actions/blocks';
import {
	requestCreateCustom,
	RECIEVE_CREATE_CUSTOM,
	FAILURE_CREATE_CUSTOM,
} from 'actions/blocks/custom';
import { processingStart, processingEnd } from 'actions/process';

/**
 * 更換模板儲存
 */
export function* watchBlockSettingChange() {
	yield takeLatest(
		[ADD_CARD, ARCHIVE_CARD, CHANGE_TEMPLATE, CHANGE_THEME, SAVE_MASK],
		function*(action) {
			yield put(processingStart('update-block-setting'));
			try {
				const { uniKey, templateType, blockType, needCreate } = action;
				const pid = yield select(state => state.getIn(['user', 'pid']));

				// TODO: pass 換主題
				if (action.type === CHANGE_THEME) return;

				// 新增 block
				if (needCreate) {
					yield put(
						requestCreateBlock({
							blockId: uniKey,
							pid,
							template: templateType,
							type: blockType,
							visibility: true,
							mask: {},
						})
					);

					const createBlockResult = yield take([
						RECIEVE_CREATE_BLOCK,
						FAILURE_CREATE_BLOCK,
					]);
					if (createBlockResult.error) throw Error(createBlockResult);

					if (blockType === 'custom') {
						const dataModel = yield select(state =>
							state.getIn(['data', uniKey]).toJS()
						);

						yield put(requestCreateCustom({ ...dataModel, pid }));
						const createCustomResult = yield take([
							RECIEVE_CREATE_CUSTOM,
							FAILURE_CREATE_CUSTOM,
						]);
						if (createCustomResult.error) throw Error(createCustomResult);
					}
					return;
				}

				// 更新現有 block
				const entity = yield select(state => state.getIn(['config', uniKey]));
				const blockInfo = {
					blockId: uniKey,
					pid,
					template: entity.get('templateType'),
					type: entity.get('blockType'),
					visibility: entity.get('visibility'),
					mask: entity
						.get('mask')
						.map(elm =>
							Map({ name: elm.get('maskName'), alpha: elm.get('maskAlpha') })
						),
				};

				yield put(requestUpdateBlock(blockInfo));
				const updateResult = yield take([
					RECIEVE_UPDATE_BLOCK,
					FAILURE_UPDATE_BLOCK,
				]);
				if (updateResult.error) throw Error(updateResult);
			} catch (e) {
				console.error(e);
			} finally {
				yield put(processingEnd('update-block-setting'));
			}
		}
	);
}
