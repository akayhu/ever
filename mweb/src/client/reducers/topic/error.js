import {RECEIVE_FAIL} from 'src/client/actions/general';
import {RECEIVE_TOPIC_DATA} from 'src/client/actions/topic';
import {isActionForReducer} from 'src/util/checkTools';

const passMap = {
	domain: ['topic'],
	key: ['initList'],
};

function error(state = false, action) {
	if (!isActionForReducer({passMap, action})) {
		return state;
	}
	switch (action.type) {
		case RECEIVE_FAIL: {
			return true;
		}
		case RECEIVE_TOPIC_DATA: {
			return false;
		}
		default:
			return state;
	}
}

export default error;
