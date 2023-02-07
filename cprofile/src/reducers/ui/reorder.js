import Immutable from 'immutable';
import { TOGGLE_REORDER_CONFIRM } from 'actions/ui/reorder';

const initState = Immutable.fromJS({
	visibility: false,
});

const ReOrderReducer = (state = initState, action) => {
	switch (action.type) {
		case TOGGLE_REORDER_CONFIRM:
			return state.set('visibility', action.visibility);
		default:
			return state;
	}
};

export default ReOrderReducer;
