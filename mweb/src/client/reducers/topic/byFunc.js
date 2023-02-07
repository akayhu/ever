import {INIT_TOPIC_MODEL} from 'src/client/actions/topic';
import {
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
} from 'src/client/actions/general';
import {isActionForReducer} from 'src/util/checkTools';
import forTopic from './forTopic';

/**
 * 設置passMap
 */
const passMap = {
	domain: ['topic'],
	key: ['initTopicModel', 'hots'],
};

const initState = {};

export default (state = initState, action) => {
	if (!isActionForReducer({passMap, action})) {
		return state;
	}
	switch (action.type) {
		case INIT_TOPIC_MODEL:
		case RECEIVE_DATA:
		case RECEIVE_FAIL:
		case REQUEST_DATA:
		case REACH_END: {
			const {option: {func}} = action.payload;
			return {
				...state,
				[func]: forTopic(state[func], action),
			};
		}
		case RESET_LIST: {
			const {key, option: {func}} = action.payload;
			// key為alltopics則重置所有職類(清空)
			if (key === 'alltopics') {
				return initState;
			}
			// 重置此職類的某一項(根據key)
			return {
				...state,
				[func]: forTopic(state[func], action),
			};
		}
		default:
			return state;
	}
};
