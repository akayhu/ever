import { fromJS } from 'immutable';
import {
	RECIEVE_SEARCH_PROFILE_LIST,
	RECIEVE_SIMILAR_PROFILE_LIST,
	RECIEVE_MY_SIMILAR_PROFILE_LIST,
	RECIEVE_FEATURED_PROFILE_LIST,
	CLEAR_PREVIOUS_SEARCH,
	CLEAR_PREVIOUS_SIMILAR,
	SET_PROFILE_PRIVACY,
	validPrivacyTypes,
} from 'actions/profile';
import { isUUID } from 'utils/validation';

// REFACTOR: 針對 profile 重新調整結構
const initState = fromJS({
	search: [],
	featured: [],
	similar: [], // 與自己相似、與某人相似共用這個
	privacy: {
		type: 'PRIVATE',
		token: null,
	},
});

const profileReducer = (state = initState, action) => {
	switch (action.type) {
		case RECIEVE_SEARCH_PROFILE_LIST: {
			const { dataList } = action.payload;
			return state.updateIn(['search'], list =>
				dataList.reduce(
					(newList, newPerson) =>
						newList
							.filter(person => person.get('pid') !== newPerson.pid)
							.push(fromJS(newPerson)),
					list
				)
			);
		}

		case RECIEVE_SIMILAR_PROFILE_LIST: {
			return state.set('similar', fromJS(action.payload || []));
		}

		case RECIEVE_MY_SIMILAR_PROFILE_LIST: {
			const { dataList } = action.payload;
			return state.updateIn(['similar'], list =>
				dataList.reduce(
					(newList, newPerson) =>
						newList
							.filter(person => person.get('pid') !== newPerson.pid)
							.push(fromJS(newPerson)),
					list
				)
			);
		}

		case RECIEVE_FEATURED_PROFILE_LIST: {
			return state.set('featured', fromJS(action.payload || []));
		}

		case CLEAR_PREVIOUS_SEARCH: {
			return state.set('search', fromJS([]));
		}

		case CLEAR_PREVIOUS_SIMILAR: {
			return state.set('similar', fromJS([]));
		}

		case SET_PROFILE_PRIVACY: {
			const { privacy, token } = action;
			if (!validPrivacyTypes.includes(privacy)) return state;
			if (typeof token === 'string' && !isUUID(token)) return state;

			return state
				.setIn(['privacy', 'type'], privacy)
				.setIn(['privacy', 'token'], token);
		}

		default:
			return state;
	}
};

export default profileReducer;
