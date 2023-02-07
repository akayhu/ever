import { fromJS } from 'immutable';
import { PUSH_SYS_MESSAGE, DEL_SYS_MESSAGE } from 'actions/ui/systemMessage';

const initState = fromJS([]);

const SystemMessageReducer = (state = initState, action) => {
	switch (action.type) {
		case PUSH_SYS_MESSAGE: {
			return state.push(fromJS(action.payload));
		}
		case DEL_SYS_MESSAGE: {
			return state.filter(message => message.get('id') !== action.id);
		}
		default:
			return state;
	}
};

export default SystemMessageReducer;
