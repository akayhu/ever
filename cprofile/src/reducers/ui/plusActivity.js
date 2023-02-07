import Immutable from 'immutable';
import { HAS_PLUS_ACTIVITY } from 'actions/ui/plusActivity';

const initState = Immutable.fromJS({
	hasPlusActivity: false,
});

const PlusActivityReducer = (state = initState, action) => {
	switch (action.type) {
		case HAS_PLUS_ACTIVITY:
			return state.update('hasPlusActivity', value => true);
		default:
			return state;
	}
};

export default PlusActivityReducer;
