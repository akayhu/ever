import {
	CREATE_NEW_MESSAGE,
	SET_READING_CHATID,
	DELETE_CHATROOM_BY_ID_FROM_LIST
} from '../../actions/message';

export const initialState = 0;

export default function readingChatId(state = initialState, action) {
	try{
		switch (action.type) {
			case DELETE_CHATROOM_BY_ID_FROM_LIST:
			case CREATE_NEW_MESSAGE:
				return 0;
			case SET_READING_CHATID:
				return action.chatId;
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
