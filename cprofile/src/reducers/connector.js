import { PUSHER_MESSAGE_RECEIVED } from 'actions/pusher';
import { Record, fromJS, List } from 'immutable';
import { UPDATE_CONNECTOR_STATUS } from 'actions/blocks/connector';

// REFACTOR: 需統一 data model
export const connectorModel = (payload = {}) =>
	fromJS({
		dataList: List(),
		pid: -3,
		type: null,
		...payload,
	});

// initState Creator
const cardRecord = (blockType = '') => {
	const initState = {
		hasToken: false,
		hasSnapshot: false,
		rawData: blockType === 'plus_activity' ? connectorModel() : null, // REFACTOR: 避免 github 與 behance 判斷錯誤的 workaround, 待重構
		errorMessage: null,
	};
	return Record(initState);
};

const initState = fromJS({
	behance: cardRecord('behance')(),
	github: cardRecord('github')(),
});

// 更新第三方服務連結狀態
const updateConnectorStatus = (state, action) => {
	return state
		.updateIn(
			[action.blockType, 'hasToken'],
			elm => action.payload.hasToken || elm
		)
		.updateIn(
			[action.blockType, 'hasSnapshot'],
			elm => action.payload.hasSnapshot || elm
		)
		.updateIn(
			[action.blockType, 'rawData'],
			elm => fromJS(action.payload.rawData) || elm
		)
		.updateIn(
			[action.blockType, 'errorMessage'],
			elm => fromJS(action.payload.errorMessage) || ''
		);
};

const pusherMessageReceived = (state, action) => {
	// TODO: 目前只有 github 使用，以後擴充服務時要調整 msg 的 model
	return state.setIn(['github', 'hasToken'], action.msg);
};

const ConnectorReducer = (state = initState, action) => {
	switch (action.type) {
		case UPDATE_CONNECTOR_STATUS:
			return updateConnectorStatus(state, action);
		case PUSHER_MESSAGE_RECEIVED:
			return pusherMessageReceived(state, action);
		default:
			return state;
	}
};

export default ConnectorReducer;
