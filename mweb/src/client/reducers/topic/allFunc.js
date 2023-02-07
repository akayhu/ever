import {
	RECEIVE_TOPIC_DATA,
	REQUEST_TOPIC_DATA,
} from 'src/client/actions/topic';
import {RECEIVE_FAIL} from 'src/client/actions/general';
import {isActionForReducer} from 'src/util/checkTools';

const passMap = {
	domain: ['topic'],
	key: ['initList'],
};

const initState = {
	funcList: [],
	loading: false,
	error: false,
	hasLoaded: false,
}

export default (state = initState, action) => {
	if (!isActionForReducer({passMap, action})) {
		return state;
	}
	switch (action.type) {
		case REQUEST_TOPIC_DATA: {
			return {
				...state,
				loading: true,
				error: false,
			};
		}
		case RECEIVE_TOPIC_DATA: {
			const {source} = action.payload;
			
			return {
				...state,
				funcList: source,
				loading: false,
				error: false,
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
		default:
			return state;
	}
};
