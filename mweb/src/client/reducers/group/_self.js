import {GET_MY_GROUP_INIT_DATA} from 'src/client/actions/group';
import {
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST
} from 'src/client/actions/general';
import {baseListModel} from 'src/client/reducers/listModel';
import singleGroupReducer from './singleGroupReducer';
// utils
import {isWrong, isActionForReducer} from 'src/util/checkTools';

const passMap = {
	domain: ['group'],
	key: ['joined', 'waitForJoin', 'managed', 'checking', 'rejected']
}

export default function self(state = {}, action) {
	switch (action.type) {
		// case GET_MY_GROUP_INIT_DATA: {
		// 	const {response} = action.response;

		// 	if (isWrong(response)) {
		// 		return state;
		// 	}
		// 	// 當某個類別的total數大於0時才儲存，並放入self中
		// 	console.info(response)
		// 	return Object.keys(response)
		// 		.filter(item => response[item].total > 0)
		// 		.reduce((final, item) => ({
		// 			...final,
		// 			[item]: {...baseListModel}
		// 		}), {});
		// }
		case REQUEST_DATA:
		case RECEIVE_DATA:
		case RECEIVE_FAIL:
		case REACH_END:
		case RESET_LIST: {
			/*
			// key為 'activity'則不處理
			// key為 'joined', 'waitForJoin', 'managed', 'checking', 'rejected'其中之一才處理
			*/
			if (!isActionForReducer({passMap, action})) {
				return state;
			}

			return singleGroupReducer(state, action);
		}
		default:
			return state;
	}
}
