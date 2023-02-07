import * as notificationActions from '../../actions/notification';
import * as pusherActions from '../../actions/pusher';

export const initState = {
	notificationList: {
		dataList: []
	},
	empty: false,
	error: false
};

export default function notificationReducer(state = initState, action) {
	try {
		switch (action.type) {
			case notificationActions.GET_NOTIFICTION_BY_PID:
				if (!action.response || !action.response.response || action.response.error) {
					return {
						...state,
						error: true
					};
				}

				const dataList = action.response.response.dataList || [];

				return {
					...state,
					notificationList: { dataList },
					empty: (dataList.length <= 0)
				};
			case pusherActions.PUSHER_MESSAGE_RECEIVED:
				if (action.msg) {
					let dataArr = state.notificationList.dataList;
					return {
						...state,
						notificationList: { dataList: [action.msg, ...dataArr] }
					};
				}
			default:
				return state;
		}
	} catch(e) {
		console.log(e);
		return state;
	}
};
