import { CHANGE_SHOWTAG, CHANGE_BOX } from 'actions/ui/factory';
import { CHANGE_THEME } from 'actions/ui/card';
import Immutable from 'immutable';

const initState = Immutable.fromJS({
	showTag: '',
	controlKey: 'custom',
	theme: '',
});

const FactoryReducer = (state = initState, action) => {
	switch (action.type) {
		case CHANGE_SHOWTAG:
			return state.set('showTag', action.tag);
		case CHANGE_BOX:
			return state.set('controlKey', action.tag);
		case CHANGE_THEME:
			return state.set('theme', action.templateType);
		default:
			return state;
	}
};

export default FactoryReducer;
