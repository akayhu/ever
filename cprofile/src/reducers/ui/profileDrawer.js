import Immutable from 'immutable';
import {
	PROFILE_DRAWER_OPEN,
	PROFILE_DRAWER_CLOSE,
} from 'actions/ui/profileDrawer';

const initState = Immutable.fromJS({
	visible: false,
});

const ProfileDrawerReducer = (state = initState, action) => {
	switch (action.type) {
		case PROFILE_DRAWER_OPEN:
			return state.update('visible', value => true);
		case PROFILE_DRAWER_CLOSE:
			return state.update('visible', value => false);
		default:
			return state;
	}
};

export default ProfileDrawerReducer;
