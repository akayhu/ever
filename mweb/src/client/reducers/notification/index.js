import { LOADING_NOTIFICATION, GET_NOTIFICATION_LIST } from 'src/client/actions/notification';
import { PUSHER_MESSAGE_RECEIVED } from 'c_platform/lib/client/actions/pusher';

const initState = {
	dataList: [],
	cursor: null,
	hasNext: false,
	isLoading: false,
	error: false,
};

const notificationReducer = (state = initState, action) => {
	switch (action.type) {
		case LOADING_NOTIFICATION:
			// 讀取到底 or 讀取中都忽略
			if (state.isLoading) return state;
			if (state.dataList.length > 0 && !state.hasNext) return state;
			return Object.assign({}, state, { isLoading: true, error: false });

		case GET_NOTIFICATION_LIST:
			// 讀取到底需忽略
			if (state.dataList.length > 0 && !state.hasNext) return state;
			// 沒有收到回應 or 出現 error
			if (!action.response || !action.response.response || action.response.error) return Object.assign({}, state, { error: true, isLoading: false });

			const res = action.response.response;
			return Object.assign({}, state, {
				dataList: [...state.dataList, ...res.dataList],
				cursor: res.cursor,
				hasNext: res.hasNext,
				isLoading: false,
				error: false,
			});

		case PUSHER_MESSAGE_RECEIVED:
			// 收到 category 不為 notification，不予理會
			if (!action.category || action.category !== 'notification') return state;

			// 若列表完全沒有載入過，不新推一筆，僅更新泡泡，讓使用者點開時能順利重載列表
			if (!state.dataList.length) return state;
			return Object.assign({}, state, { dataList: [action.msg, ...state.dataList] });

		default:
			return state;
	}
};

export default notificationReducer;
