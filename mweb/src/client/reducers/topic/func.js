import {CHANGE_FUNC} from 'src/client/actions/topic';

export default (state = '', action) => {
	switch (action.type) {
		case CHANGE_FUNC: {
			const {func} = action.payload;
			return func;
		}
		default:
			return state;
	}
};
