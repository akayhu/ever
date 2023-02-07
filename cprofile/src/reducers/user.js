import { Record, fromJS } from 'immutable';
import {
	REQUEST_LOGIN_STATUS,
	RECIEVE_LOGIN_STATUS,
	FAILURE_LOGIN_STATUS,
	REQUEST_INITIAL_PROFILE,
	RECIEVE_INITIAL_PROFILE,
	FAILURE_INITIAL_PROFILE,
	UPDATE_USER_DATA,
} from 'actions/user';
import {
	PUSHER_CONNECT,
	PUSHER_CONNECT_ERROR,
	PUSHER_SUBSCRIBE_CHANNEL,
	PUSHER_SUBSCRIBE_CHANNEL_SUCCESS,
	PUSHER_SUBSCRIBE_CHANNEL_ERROR,
} from 'actions/pusher';

const initState = Record({
	pid: -3,
	login: false,
	initial: false,
	pusher: 'initial',
	status: 'initial', // initial, pending, done, error
	data: fromJS({}),
})();

const UserReducer = (state = initState, action) => {
	switch (action.type) {
		case REQUEST_LOGIN_STATUS:
		case REQUEST_INITIAL_PROFILE:
			return state.set('status', 'pending');

		case RECIEVE_LOGIN_STATUS:
			const { PI, type } = action.payload;
			if (type < 2) {
				return initState.set('status', 'done');
			} else if (type === 2) {
				// 未啟用服務
				return state
					.set('pid', PI)
					.set('login', true)
					.set('initial', false)
					.set('status', 'done');
			} else if (type === 3) {
				// 已啟用服務
				return state
					.set('pid', PI)
					.set('login', true)
					.set('initial', true)
					.set('status', 'done');
			}
			return state
				.set('pid', PI)
				.set('login', true)
				.set('status', 'done');

		case RECIEVE_INITIAL_PROFILE:
			return state.set('initial', true).set('status', 'done');

		case FAILURE_LOGIN_STATUS:
		case FAILURE_INITIAL_PROFILE:
			return state.set('status', 'error');

		case UPDATE_USER_DATA:
			if (!action.payload.avatarFileUrls) action.payload.avatarFileUrls = {};
			if (!action.payload.coverFileUrls) action.payload.coverFileUrls = {};
			return state.set('data', fromJS(action.payload));

		case PUSHER_CONNECT:
		case PUSHER_SUBSCRIBE_CHANNEL:
			return state.set('pusher', 'pending');

		case PUSHER_SUBSCRIBE_CHANNEL_SUCCESS:
			return state.set('pusher', 'success');

		case PUSHER_CONNECT_ERROR:
		case PUSHER_SUBSCRIBE_CHANNEL_ERROR:
			return state.set('pusher', 'error');

		default:
			return state;
	}
};

export default UserReducer;
