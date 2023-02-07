import {
	CREATE_NEW_MESSAGE,
	SET_READING_CHATID
} from '../../actions/message';

export const initialState = false;

export default function isNewMessage(state = initialState, action) {
	try{
		switch (action.type) {
			case CREATE_NEW_MESSAGE:
				return true;
			case SET_READING_CHATID:
				return false;
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
