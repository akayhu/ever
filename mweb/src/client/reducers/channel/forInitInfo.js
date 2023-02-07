import {
	RECEIVE_GROUP_DATA_FAIL,
	REQUEST_GROUP_DATA,
	RECEIVE_GROUP_DATA,
} from 'src/client/actions/channel';
import {baseListModel} from 'src/client/reducers/listModel';

export default function forAllGroup(state, action, type) {return state;
	switch (action.type) {
		case REQUEST_GROUP_DATA: {
			return {
				...state,
				loading: true,
				error: false,
			};
		}
		case RECEIVE_GROUP_DATA: {
			const {response} = action.payload;
			let byGroup;

			if (type === 'all') {
				byGroup = response.reduce((final, item) => ({
					...final,
					[item.categoryName]: {
						...item,
						...baseListModel,
					},
				}), {});
			} else if (type === 'self') {
				byGroup = Object.keys(response)
				.filter(item => item === 'joined')
				// .filter(item => response[item].total > 0) // 因為現階段只要出現"我加入的"
				.reduce((final, item) => ({
					...final,
					[item]: {
						...baseListModel,
						total: response[item].total,
					},
				}), {});
			}
			return {
				...state,
				loading: false,
				error: false,
				hasLoaded: true,
				byGroup,
			};
		}
		case RECEIVE_GROUP_DATA_FAIL: {
			return {
				...state,
				loading: false,
				error: true,
			};
		}
		default:
			return state;
	}
}
