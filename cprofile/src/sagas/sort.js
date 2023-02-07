import { put, take, select, takeLatest } from 'redux-saga/effects';
// import { delay } from 'redux-saga';
import { fromJS, List } from 'immutable';
import { ADD_CARD, ARCHIVE_CARD } from 'actions/ui/card';
import {
	requestUpdateSortList,
	RECIEVE_UPDATE_SORT_LIST,
	FAILURE_UPDATE_SORT_LIST,
	UPDATE_SORT_PROCESS,
} from 'actions/sort';
import { processingStart, processingEnd } from 'actions/process';
import nameMap from 'config/nameMap';

// sortType = BLOCK
export function* watchBlockSortChange() {
	yield takeLatest(
		action => {
			const validActions = List([ADD_CARD, ARCHIVE_CARD]);
			if (validActions.includes(action.type)) return true;
			if (action.type === UPDATE_SORT_PROCESS && action.sortType === 'BLOCK')
				return true;
			return false;
		},
		function*(action) {
			console.log(`[sort] start | blocksList`);
			yield put(processingStart('update-block-sort'));
			try {
				const pid = yield select(state => state.getIn(['user', 'pid']));
				const sortList = yield select(state => state.get('blocksList'));

				// 更新 block sort
				console.log(`[sort] process | blocksList`);
				yield put(requestUpdateSortList({ pid, sortList, type: 'BLOCK' }));
				const result = yield take([
					RECIEVE_UPDATE_SORT_LIST,
					FAILURE_UPDATE_SORT_LIST,
				]);
				if (result.error) throw Error(result);
			} catch (e) {
				console.error(e);
			} finally {
				yield put(processingEnd('update-block-sort'));
				console.log(`[sort] done | blocksList`);
			}
		}
	);
}

// sortType = HONOR, GALLERY, TALENT
export function* watchBlockElemSortChange() {
	yield takeLatest(
		action => {
			const validSortTypes = List(['HONOR', 'GALLERY', 'TALENT']);
			if (
				action.type === UPDATE_SORT_PROCESS &&
				validSortTypes.includes(action.sortType)
			)
				return true;
			return false;
		},
		function*(action) {
			console.log(
				`[sort] start | blockElem | block: ${action.payload.blockType}`
			);
			yield put(processingStart('update-block-elem-sort'));
			try {
				const pid = yield select(state => state.getIn(['user', 'pid']));
				const type = action.sortType;
				const uidName = fromJS(nameMap).getIn([
					action.payload.blockType,
					'uidName',
				]);
				const sortList = yield select(state =>
					state
						.getIn(['data', action.payload.uniKey])
						.map(elm => elm.get(uidName))
						.filter(uid => !/tmp-/.test(uid))
				);

				if (!type) return;
				if (!sortList.size) return;

				console.log(
					`[sort] process | blockElem | block: ${action.payload.blockType}`
				);
				yield put(
					requestUpdateSortList({ pid, sortList: sortList.toJS(), type })
				);
				const result = yield take([
					RECIEVE_UPDATE_SORT_LIST,
					FAILURE_UPDATE_SORT_LIST,
				]);
				if (result.error) throw Error(result);
			} catch (e) {
				console.error(e);
			} finally {
				yield put(processingEnd('update-block-elem-sort'));
				console.log(
					`[sort] done | blockElem | block: ${action.payload.blockType}`
				);
			}
		}
	);
}
