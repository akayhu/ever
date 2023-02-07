import {RECEIVE_FAIL} from 'src/client/actions/general';
import {
	CHANGE_PROFILE_PAGE,
	CHANGE_CONNECTION_STATUS,
	GET_VIEW_AS
} from 'src/client/actions/profile';
import { SAVE_CONFIG } from 'src/client/actions/utils';
import {isActionForReducer} from 'src/util/checkTools';


/**
 * {
			profilePid: 108190,
			error: false,
			loading: false,
			viewAs: 'self',
		}
 */

const passMapForOther = {
	domain: ['profile'],
	key: ['info']
};


const initialState = {
	profilePid: '', // 紀錄現在在看哪個profile頁
	tab: 'info',
	error: false,
	loading: false,
	viewAs: 'other',
	connectionStatus: 0,
	config: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_PROFILE_PAGE: {
			const {pid, tab} = action.payload;
			return {
				...state,
				profilePid: pid,
				tab,
				error: false
			};
		}
		case CHANGE_CONNECTION_STATUS: {
			const {key, status} = action.payload;
			return {
				...state,
				[key]: status,
			};
		}
		case GET_VIEW_AS: {
			const {viewAs, connectionStatus, subscribeStatus, notificationStatus} = action.payload;
			return {
				...state,
				viewAs,
				connectionStatus,
				subscribeStatus,
				notificationStatus,
			};
		}
		case RECEIVE_FAIL: {
			// 是profile的fail才進來
			if (!isActionForReducer({passMap: passMapForOther, action})) return state;
			return {
				...state,
				error: true,
			};
		}
		case SAVE_CONFIG: {
			return {
				...state,
				config: {
					...state.config,
					[action.config]: action.value
				}
			}
		}
		default:
			return state;
	}
};
