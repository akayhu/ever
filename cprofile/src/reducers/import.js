import { fromJS } from 'immutable';
import { UPDATE_IMPORT_SERVICE_STATUS } from 'actions/blocks/import';

const initState = fromJS({
	my104: {
		hasData: false,
		rawData: null,
	},
});

// 更新 reducer 匯入服務狀態
const updateImportServiceStatus = (state, action) => {
	return state
		.updateIn(
			[action.serviceName, 'hasData'],
			elm => action.payload.hasData || elm
		)
		.updateIn(
			[action.serviceName, 'rawData'],
			elm => fromJS(action.payload.rawData) || elm
		);
};

const ImportReducer = (state = initState, action) => {
	switch (action.type) {
		case UPDATE_IMPORT_SERVICE_STATUS:
			return updateImportServiceStatus(state, action);
		default:
			return state;
	}
};

export default ImportReducer;
