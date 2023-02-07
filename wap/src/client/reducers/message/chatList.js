import chatItem from './chatItem';
import {
	REQUEST_DATA,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REACH_END,
	INIT_CHAT_ITEM,
	ADD_CHAT_ITEM,
	CLEAR_CHAT,
	DELETE_CHATROOM_BY_ID_FROM_LIST
} from '../../actions/message';

export const initialState = {
	0: {
		dataList: [],
		error: false,
		loading: false,
		end: false,
		count: 0,
		dateTime: ''
	}
};

const chatList = (state = initialState, action) => {
	try {
		const { category } = action;
		if (category !== 'chatList' && category !== 'messageList')
			return state;
		switch (action.type) {
			case REQUEST_DATA:
			case RECEIVE_DATA:
			case RECEIVE_FAIL:
			case REACH_END:
			case ADD_CHAT_ITEM:
			case CLEAR_CHAT:
			case INIT_CHAT_ITEM: {
				const { chatId } = action;
				if (!chatId) {
					return state;
				}
				return {...state,
					[chatId]: chatItem(state[chatId], action)
				};
			}
			case DELETE_CHATROOM_BY_ID_FROM_LIST: {
				delete state[action.chatId];
				return {...state};
			}
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
};

export default chatList;
