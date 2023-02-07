import Immutable from 'immutable';
import {
	MOBILE_DRAWER_OPEN,
	MOBILE_DRAWER_CLOSE,
} from 'actions/ui/mobileDrawer';

const initState = Immutable.fromJS({
	visible: false,
});

const MobileDrawerReducer = (state = initState, action) => {
	switch (action.type) {
		case MOBILE_DRAWER_OPEN:
			return state.update('visible', value => true);
		case MOBILE_DRAWER_CLOSE:
			return state.update('visible', value => false);
		default:
			return state;
	}
};

export default MobileDrawerReducer;
