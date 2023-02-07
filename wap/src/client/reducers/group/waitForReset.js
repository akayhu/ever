import { SET_SHOULD_RESET,  CLEAR_SHOULD_RESET } from '../../actions/group';

export const initListState = [];

const waitForReset = (state = initListState, action) => {
	try{
		switch (action.type) {
			case SET_SHOULD_RESET:
				return state.indexOf(action.category) === -1
	        ? [...state, action.category]
	        : state;
			case CLEAR_SHOULD_RESET:
				return state.filter(item => item !== action.category);
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};

export default waitForReset;
