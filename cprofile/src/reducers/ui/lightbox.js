import Immutable from 'immutable';
import { LIGHTBOX_OPEN, LIGHTBOX_CLOSE } from 'actions/ui/lightbox';

const initState = Immutable.fromJS({
	visible: false,
});

const LightboxReducer = (state = initState, action) => {
	switch (action.type) {
		case LIGHTBOX_OPEN:
			return state.update('visible', value => true);
		case LIGHTBOX_CLOSE:
			return state.update('visible', value => false);
		default:
			return state;
	}
};

export default LightboxReducer;
