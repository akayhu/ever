import {
	CHANGE_FUNC
} from '../../actions/topic';

export const initalState = '';

export default function (state = initalState, action) {
	try {
		switch (action.type) {
			case CHANGE_FUNC: {
				const {func} = action.payload;
				return func;
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
