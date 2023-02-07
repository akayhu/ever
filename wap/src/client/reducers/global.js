import * as GlobalActionType from '../actions/global';
import { LOADED_FRIEND_ALL } from '../actions/connection';

export const initialState = {
	promotion: 'none',
	nextPromotion: 'none',
	edittingHintBox: false,
	onChange: false,
	myFriendList: {
		list: [],
		initStatus: false
	},
	done:{}
};

export default function globalReducer(state = initialState, action) {
	try{
		switch (action.type) {
			case GlobalActionType.CREATE_FROM_PROMOTION:
				// something is opening
				if (state.onChange) {
					if (state.promotion !== action.target.promotion && state.edittingHintBox === false) {
						return Object.assign({}, state, { nextPromotion: action.target.promotion, edittingHintBox: true });
					} else {
						return Object.assign({}, state, { promotion: action.target.promotion, edittingHintBox: false, onChange: action.target.onChange });
					}
				// none
				} else {
					return Object.assign({}, state, { promotion: action.target.promotion, onChange: action.target.onChange });
				}
			case GlobalActionType.ONCHANGE_FROM_PROMOTION:
				return Object.assign({}, state, { onChange: true });
			case GlobalActionType.INITIAL_FROM_PROMOTION:
				initialState.myFriendList = state.myFriendList;
				return Object.assign({}, state, initialState);
			case LOADED_FRIEND_ALL: {
				
				if (action.mentionList.length === 0) return state;
				return Object.assign({}, state, { myFriendList: { list: action.mentionList, initStatus: true } });
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};
