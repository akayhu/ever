import Immutable from 'immutable';
import {
	MOBILE_PROMPT_OPEN,
	MOBILE_PROMPT_CLOSE,
} from 'actions/ui/mobilePrompt';

const initState = Immutable.fromJS({
	visible: true,
});

const MobilePromptReducer = (state = initState, action) => {
	switch (action.type) {
		case MOBILE_PROMPT_OPEN:
			return state.update('visible', value => true);
		case MOBILE_PROMPT_CLOSE:
			return state.update('visible', value => false);
		default:
			return state;
	}
};

export default MobilePromptReducer;
