import { SET_SHOULD_RESET, CLEAR_SHOULD_RESET } from '../../actions/message';

export const initialState = [];

const waitForReset = (state = initialState, action) => {
	try{
		if (action.subtree !== 'message')
			return state;
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
