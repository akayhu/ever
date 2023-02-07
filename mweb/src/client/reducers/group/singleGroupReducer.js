import {
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
} from 'src/client/actions/general';
import {baseListModel} from 'src/client/reducers/listModel';

/*
{
	項目A: {
		dataList: [],
		error: false,
		loading: false,
		offset: 0,
		end: false,
		hasLoaded: false
	},
	項目A: { ... },
	項目A: { ... }
}
*/

export default function singleGroupReducer(state = {}, action) {
	const {domain, key} = action.payload;

	switch (action.type) {
		case RECEIVE_DATA:
			return {
				...state,
				[key]: {
					...state[key],
					dataList: [...state[key].dataList, ...action.payload.dataList],
					error: false,
					loading: false,
					offset: action.payload.offset,
					hasLoaded: true,
				},
			};
		case REQUEST_DATA:
			return {
				...state,
				[key]: {
					...state[key],
					error: false,
					loading: true,
				},
			};
		case RECEIVE_FAIL:
			return {
				...state,
				[key]: {
					...state[key],
					error: true,
					loading: false,
				},
			};
		case REACH_END:
			return {
				...state,
				[key]: {
					...state[key],
					end: true,
				},
			};
		case RESET_LIST: {
			const categories = Object.keys(state);
			if (key === `all${domain}` || key === `all${domain}s`) {
				return categories.reduce((final, category) => ({
					...final,
					[category]: {
						...state[category],
						...baseListModel,
					},
				}), {});
			}
			if (categories.indexOf(key) !== -1) {
				return {
					...state,
					[key]: {
						...state[key],
						...baseListModel,
					},
				};
			}
			return state;
		}
		default:
			return state;
	}
}
