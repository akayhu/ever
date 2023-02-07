import { fromJS } from 'immutable';
import {
	REQUEST_SEARCH_PROFILE_LIST,
	RECIEVE_SEARCH_PROFILE_LIST,
	FAILURE_SEARCH_PROFILE_LIST,
	REQUEST_SIMILAR_PROFILE_LIST,
	RECIEVE_SIMILAR_PROFILE_LIST,
	FAILURE_SIMILAR_PROFILE_LIST,
	REQUEST_MY_SIMILAR_PROFILE_LIST,
	RECIEVE_MY_SIMILAR_PROFILE_LIST,
	FAILURE_MY_SIMILAR_PROFILE_LIST,
	REQUEST_FEATURED_PROFILE_LIST,
	RECIEVE_FEATURED_PROFILE_LIST,
	FAILURE_FEATURED_PROFILE_LIST,
	SUBMIT_SEARCH_QUERY,
	CLEAR_PREVIOUS_SEARCH,
} from 'actions/profile';

const initState = fromJS({
	// 搜尋結果
	search: {
		hasNext: true,
		total: 0,
		offset: 0,
		status: 'initial', // initial、idle 閒置、loading、error
		keyword: '',
	},
	// 精選
	featured: {
		status: 'initial',
	},
	// 相似
	similar: {
		hasNext: true,
		total: 0,
		offset: 0,
		status: 'initial',
	},
});

const profileReducer = (state = initState, action) => {
	switch (action.type) {
		case REQUEST_SEARCH_PROFILE_LIST: {
			return state.setIn(['search', 'status'], 'loading');
		}

		case REQUEST_SIMILAR_PROFILE_LIST:
		case REQUEST_MY_SIMILAR_PROFILE_LIST: {
			return state.setIn(['similar', 'status'], 'loading');
		}

		case REQUEST_FEATURED_PROFILE_LIST: {
			return state.setIn(['featured', 'status'], 'loading');
		}

		case RECIEVE_SEARCH_PROFILE_LIST: {
			const { total, offset, hasNext } = action.payload;
			return state.mergeIn(['search'], {
				hasNext,
				total,
				offset,
				status: 'idle',
			});
		}

		case RECIEVE_SIMILAR_PROFILE_LIST: {
			return state.mergeIn(['similar'], {
				hasNext: false,
				total: 5,
				offset: 5,
				status: 'idle',
			});
		}

		case RECIEVE_MY_SIMILAR_PROFILE_LIST: {
			const { total, offset, hasNext } = action.payload;
			return state.mergeIn(['similar'], {
				hasNext,
				total,
				offset,
				status: 'idle',
			});
		}

		case RECIEVE_FEATURED_PROFILE_LIST: {
			return state.mergeIn(['featured'], {
				status: 'idle',
			});
		}

		case FAILURE_SEARCH_PROFILE_LIST: {
			return state.setIn(['search', 'status'], 'error');
		}

		case FAILURE_SIMILAR_PROFILE_LIST:
		case FAILURE_MY_SIMILAR_PROFILE_LIST: {
			return state.setIn(['similar', 'status'], 'error');
		}

		case FAILURE_FEATURED_PROFILE_LIST: {
			return state.setIn(['featured', 'status'], 'error');
		}

		case SUBMIT_SEARCH_QUERY: {
			return state.setIn(['search', 'keyword'], action.keyword);
		}

		case CLEAR_PREVIOUS_SEARCH:
			return state.set(
				'search',
				fromJS({
					hasNext: true,
					total: 0,
					offset: 0,
					status: 'initial', // initial、idle 閒置、loading、error
					keyword: '',
				})
			);

		default:
			return state;
	}
};

export default profileReducer;
