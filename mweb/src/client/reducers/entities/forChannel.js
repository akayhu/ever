import {
	INITIAL_ENTITY,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
	RESET_KEY_IN_ENTITY
} from 'src/client/actions/general';
import {channelModel} from 'src/client/reducers/listModel';

export default function (state, action) {
	switch (action.type) {
		case INITIAL_ENTITY: {
			const {source} = action.payload.option;
			return {
				...channelModel,
				channelInfo: {...source},
				hasLoaded: true,
			};
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
			const {key, dataList, offset, total} = action.payload;
			let _dataList = dataList ? dataList : [];
			// console.log("/******* Channel RECEIVE_DATA ********/");
			// console.log(key);
			// console.log(state);
			// console.log(state[key]);
			// console.log(dataList);
			return {
				...state,
				[key]: {
					...state[key],
					dataList: [...state[key].dataList, ..._dataList],
					offset,
					loading: false,
					hasLoaded: true,
					total
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

			if (key === 'allgroup') {
				return channelModel;
			}

			return {
				...state,
				[key]: channelModel[key],
			};
		}
		case RESET_KEY_IN_ENTITY: {
			const {resetKey} = action.payload.option;
			
			return {
				...state,
				channelInfo: {
					...state.channelInfo,
					...resetKey
				}
			};
		}
		default:
			break;
	}
}
