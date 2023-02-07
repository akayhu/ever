import {INIT_TOPIC_MODEL} from 'src/client/actions/topic';
import {
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
} from 'src/client/actions/general';
import {topicModel, baseListModel} from 'src/client/reducers/listModel';

export default (state, action) => {
	switch (action.type) {
		case INIT_TOPIC_MODEL: {
			return topicModel;
		}
		case REQUEST_DATA: {
			const {key} = action.payload;
			return {
				...state,
				[key]: {
					...state[key],
					loading: true,
					error: false,
				},
			};
		}
		case RECEIVE_DATA: {
			const {key, dataList, offset} = action.payload;
			return {
				...state,
				[key]: {
					...state[key],
					dataList: [...state[key].dataList, ...dataList],
					loading: false,
					error: false,
					hasLoaded: true,
					offset,
				},
			};
		}
		case RECEIVE_FAIL: {
			const {key} = action.payload;
			return {
				...state,
				[key]: {
					...state[key],
					loading: false,
					error: true,
				},
			};
		}
		case REACH_END: {
			const {key} = action.payload;
			return {
				...state,
				[key]: {
					...state[key],
					end: true,
				},
			};
		}
		case RESET_LIST: {
			const {key} = action.payload;
			// key為alltopic則重置此職類為topicModel
			if (key === 'alltopic') {
				return topicModel;
			}
			// 重置此職類的key為baseListModel
			// 目前職類下面的項目都是ListModel，若有別的則要在下條件判斷
			return {
				...state,
				[key]: baseListModel,
			};
		}
		default:
			return state;
	}
};
