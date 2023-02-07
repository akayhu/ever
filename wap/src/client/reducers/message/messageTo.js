import {
	ADD_RECEIVER,
	DELETE_RECEIVER,
	SET_READING_CHATID
} from '../../actions/message';

export const initialState = [];

export default function messageTo(state = initialState, action) {
	try{
		switch (action.type) {
			case ADD_RECEIVER: {
				return [...state, ...action.targetPids];
			}
			case DELETE_RECEIVER:
			case SET_READING_CHATID: {
				return [];
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
