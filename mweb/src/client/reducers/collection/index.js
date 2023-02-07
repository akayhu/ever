import { baseListModel } from 'src/client/reducers/listModel';
import {isActionForReducer} from 'src/util/checkTools';
import {
	REQUEST_DATA,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REACH_END,
	RESET_LIST,
} from 'src/client/actions/general';

const initialState = baseListModel;

const passMap = {
	domain: ['collection'],
	key: ['activity'],
};

export default (state = initialState, action) => {
	if (!isActionForReducer({passMap, action})) {
		return state;
	}
	switch (action.type) {
		case REQUEST_DATA: {
			return {
				...state,
				loading: true,
				error: false,
			};
		}
		case RECEIVE_DATA: {
			const {dataList, offset} = action.payload;
			return {
				...state,
				dataList: [...state.dataList, ...dataList],
				loading: false,
				error: false,
				offset: offset.ts,
				hasLoaded: true,
			};
		}
		case RECEIVE_FAIL: {
			return {
				...state,
				loading: false,
				error: true,
			};
		}
		case REACH_END: {
			return {
				...state,
				end: true,
			};
		}
		case RESET_LIST: {
			return baseListModel;
		}
		default:
			return state;
	}
};
