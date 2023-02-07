import {
	RECEIVE_CHANNEL_DATA_FAIL,
	REQUEST_CHANNEL_DATA,
	RECEIVE_CHANNEL_DATA,
} from 'src/client/actions/channel';
import {
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST,
} from 'src/client/actions/general';
// import singleChannelReducer from './singleChannelReducer';
// import forInitInfo from './forInitInfo';
// utils
// import {isActionForReducer} from 'src/util/checkTools';
import {baseListModel} from 'src/client/reducers/listModel';

// const initialState = {
// 	loading: false,
// 	error: false,
// 	hasLoaded: false,
// 	byGroup: {},
// };
/**
 * 給負責state.byGroup部分的reducer判斷action用的
 * 表示action.payload.key在falseKeys中，才不進入reducer的處理流程直接返回state
 */

export default function all(type) {
	return (state = baseListModel, action) => {
		// console.log(action);
		switch (action.type) {
			case REQUEST_CHANNEL_DATA:
			case RECEIVE_CHANNEL_DATA:
			case RECEIVE_CHANNEL_DATA_FAIL: {
				return {
					...state,
				}
			}
			case REQUEST_DATA:
			case RECEIVE_DATA:
			case RECEIVE_FAIL:
			case REACH_END:
			case RESET_LIST: {
			/*
			// 因為所有社團的類別是從API取得，不保證未來不會改變，因此用此方法去判斷
			// key為'joined', 'waitForJoin', 'managed', 'checking', 'rejected', 'activity'其中之一則不處理
			*/
				// if (falseKeys) {
				// 	if (!isActionForReducer({domain: 'channel', falseKeys, action})) {
				// 		return state;
				// 	}
				// } else if (!isActionForReducer({domain: 'channel', trueKeys, action})) {
				// 	return state;
				// }

				return {
					...state,
					// byGroup: singleChannelReducer(state.byGroup, action),
				};
			}
			default:
				return state;
		}
	};
}
