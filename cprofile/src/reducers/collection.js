import { fromJS } from 'immutable';
import { UPDATE_COLLECTION } from 'actions/collection';

const initState = fromJS([]);

// 更新 collection 資料到 redux
const updateCollection = (state, action) => {
	if (!action.payload || !Array.isArray(action.payload)) return state;
	return state.update(() => fromJS(action.payload));
};

const collectionReducer = (state = initState, action) => {
	switch (action.type) {
		case UPDATE_COLLECTION: // 更新 collection 資料到 redux
			return updateCollection(state, action);
		default:
			return state;
	}
};

export default collectionReducer;
