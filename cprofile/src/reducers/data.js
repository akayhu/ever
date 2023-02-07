import {
	INIT_CARD,
	ADD_CARD,
	UPDATE_CARD,
	ADD_BLOCK_ELEM,
	COPY_BLOCK_ELEM,
	MOVE_BLOCK_ELEM,
	DELETE_BLOCK_ELEM,
	TRANS_TEMP_ID_TO_UID,
	CHANGE_TEMPLATE,
} from 'actions/ui/card';
import Immutable, { fromJS, Map, List } from 'immutable';
import nameMap from 'config/nameMap';
import * as sample from 'config/sample';
import templates from 'templates/setting';
import { generateId } from 'utils/idGenerator';

const initState = Immutable.fromJS({});
const blockConfig = fromJS(nameMap);
const templateSetting = fromJS(templates);

// 更換區塊模組
const changeTemplate = (state, action) => {
	const { uniKey, templateType, blockType } = action;
	const multiRecords = blockConfig.getIn([blockType, 'multiRecords']);
	const uidName = blockConfig.getIn([blockType, 'uidName']);
	const sampleCount = templateSetting.getIn([
		blockType,
		templateType,
		'sampleCount',
	]);

	if (!state.has(uniKey) || !state.get(uniKey)) return state;
	if (!multiRecords) return state;
	if (!uidName || !sampleCount) return state;

	// 如果全部是未儲存的資料，就重新按模板塞不同筆數
	const isAllSampleData = !state
		.get(uniKey)
		.filter(elm => !/tmp-/.test(elm.get(uidName))).size;
	if (isAllSampleData) {
		const sampleData = List()
			.setSize(sampleCount)
			.map(() => Map({ [uidName]: generateId('tmp-new') }));
		return state.set(uniKey, sampleData);
	}
	return state;
};

// 更新區塊內資料
const updateCard = (state, action) => {
	const { uniKey, value, keyPath } = action;
	if (!uniKey) return state;
	const path = keyPath && keyPath.length > 0 ? [uniKey, ...keyPath] : [uniKey];
	return state.setIn(path, fromJS(value));
};

// 初始化區塊資料
const initCard = (state, action) => {
	const { uniKey, blockType, templateType, payload } = action;
	const multiRecords = blockConfig.getIn([blockType, 'multiRecords']);
	const uidName = blockConfig.getIn([blockType, 'uidName']);
	const sampleCount = templateSetting.getIn([
		blockType,
		templateType,
		'sampleCount',
	]);

	if (!uidName || !sampleCount) return state;

	// 塞入指定筆數的 sample (id only)
	if (!payload || (Array.isArray(payload) && !payload.length)) {
		const sampleData = multiRecords
			? List()
					.setSize(sampleCount)
					.map(() => Map({ [uidName]: generateId('tmp-new') }))
			: Map({ [uidName]: generateId('tmp-new') });
		return state.set(uniKey, sampleData);
	}
	// 塞區塊資料
	return state.set(uniKey, fromJS(payload));
};

// 新增區塊
const addCard = (state, action) => {
	const { uniKey, blockType, templateType } = action;
	const multiRecords = blockConfig.getIn([blockType, 'multiRecords']);
	const uidName = blockConfig.getIn([blockType, 'uidName']);
	const sampleCount = templateSetting.getIn([
		blockType,
		templateType,
		'sampleCount',
	]);

	if (!uidName || !sampleCount) return state;

	let sampleData;
	if (blockType === 'custom') {
		// NOTE: 客製化區塊可以新增 block, 但全空的情況下新增 custom 會回 400, 就會出現有 block 但沒有 custom 問題
		sampleData = Map({
			[uidName]: uniKey,
			title: sample.custom.title,
			description: sample.custom.description,
		});
	} else {
		// 塞入指定筆數的 sample (id only)
		sampleData = multiRecords
			? List()
					.setSize(sampleCount)
					.map(() => Map({ [uidName]: generateId('tmp-new') }))
			: Map({ [uidName]: generateId('tmp-new') });
	}

	if (!state.get(uniKey) || !state.get(uniKey).size) {
		return state.set(uniKey, sampleData);
	}
	return state;
};

// 新增一筆區塊內資料段
const addBlockElem = (state, action) => {
	const { uniKey, blockType, uid } = action;
	const uidName = blockConfig.getIn([blockType, 'uidName']);

	// custom 或不是多筆資料的區塊就忽略
	if (
		!blockConfig.get(blockType) ||
		!blockConfig.getIn([blockType, 'multiRecords']) ||
		!uidName
	)
		return state;

	// 塞入預設 data
	return state.update(uniKey, dataList =>
		dataList.unshift(Map({ [uidName]: uid }))
	);
};

// 複製一筆區塊內資料段
const copyBlockElem = (state, action) => {
	const { uniKey, blockType, prvUID, newUID } = action;
	const uidName = blockConfig.getIn([blockType, 'uidName']);

	// custom 或不是多筆資料的區塊就忽略
	if (
		!blockConfig.get(blockType) ||
		!blockConfig.getIn([blockType, 'multiRecords']) ||
		!uidName
	)
		return state;

	// 複製 data 塞在原 data 後面
	return state.update(uniKey, dataList => {
		const prvData = dataList.find(elm => elm.get(uidName) === prvUID);
		const prevIndex = dataList.findIndex(elm => elm.get(uidName) === prvUID);
		return dataList.splice(
			prevIndex + 1,
			0,
			prvData.merge({ [uidName]: newUID })
		);
	});
};

// 拖曳一筆資料段
const moveBlockElem = (state, action) => {
	const { uniKey, dragIndex, hoverIndex, blockType, uid } = action;
	return state.update(uniKey, dataList =>
		dataList
			.splice(dragIndex, 1)
			.splice(
				hoverIndex,
				0,
				dataList.find(elm => elm.get(nameMap[blockType].uidName) === uid)
			)
	);
};

// 刪除一筆資料段
const deleteBlockElem = (state, action) => {
	const { blockType, uniKey, uid } = action;
	if (!blockConfig.getIn([blockType, 'multiRecords'])) return state;
	return state.update(uniKey, dataList =>
		dataList.filter(elm => {
			const uidName = nameMap[blockType].uidName;
			return elm.get(uidName) !== uid;
		})
	);
};

// 暫時 ID 置換成真實 ID
const transTempIdToUID = (state, action) => {
	const { blockType, uniKey, tmpId, newUID } = action;
	if (!blockConfig.getIn([blockType, 'multiRecords'])) return state;
	return state.update(uniKey, dataList => {
		const uidName = nameMap[blockType].uidName;
		const tmpIdx = dataList.findIndex(elm => elm.get(uidName) === tmpId);
		return tmpIdx !== -1 ? dataList.setIn([tmpIdx, uidName], newUID) : dataList;
	});
};

const DataReducer = (state = initState, action) => {
	switch (action.type) {
		case CHANGE_TEMPLATE: // 更換區塊模組
			return changeTemplate(state, action);
		case UPDATE_CARD: // 更新區塊內資料
			return updateCard(state, action);
		case INIT_CARD: // 初始化區塊資料
			return initCard(state, action);
		case ADD_CARD: // 新增區塊
			return addCard(state, action);
		case ADD_BLOCK_ELEM: // 新增一筆區塊內資料段
			return addBlockElem(state, action);
		case COPY_BLOCK_ELEM: // 複製一筆區塊內資料段
			return copyBlockElem(state, action);
		case MOVE_BLOCK_ELEM: // 拖曳一筆資料段
			return moveBlockElem(state, action);
		case DELETE_BLOCK_ELEM: // 刪除一筆資料段
			return deleteBlockElem(state, action);
		case TRANS_TEMP_ID_TO_UID: // 暫時 ID 置換成真實 ID
			return transTempIdToUID(state, action);
		default:
			return state;
	}
};

export default DataReducer;
