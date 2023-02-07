import Immutable from 'immutable';
import {
	NOVICE_GUIDE_START,
	NOVICE_GUIDE_END,
	TOOLBAR_PROMPT_START,
	TOOLBAR_PROMPT_END,
} from 'actions/ui/noviceGuide';

const initState = Immutable.fromJS({
	noviceGuideStart: false,
	toolbarPromptStart: false,
});

const NoviceGuideReducer = (state = initState, action) => {
	switch (action.type) {
		case NOVICE_GUIDE_START:
			return state.update('noviceGuideStart', value => true);
		case NOVICE_GUIDE_END:
			return state.update('noviceGuideStart', value => false);
		case TOOLBAR_PROMPT_START:
			return state.update('toolbarPromptStart', value => true);
		case TOOLBAR_PROMPT_END:
			return state.update('toolbarPromptStart', value => false);
		default:
			return state;
	}
};

export default NoviceGuideReducer;
