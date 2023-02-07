import Immutable from 'immutable';
import {
	CHANGETO_NEW_VISITOR,
	OPEN_PRELOGIN_SERVICE,
	CLOSE_PRELOGIN_SERVICE,
} from 'actions/ui/activationGuide';

const initState = Immutable.fromJS({
	brandNewVisitor: false,
	showPreloginService: false,
});

const activationGuide = (state = initState, action) => {
	switch (action.type) {
		case CHANGETO_NEW_VISITOR:
			return state.update('brandNewVisitor', value => true);
		case OPEN_PRELOGIN_SERVICE:
			return state.update('showPreloginService', value => true);
		case CLOSE_PRELOGIN_SERVICE:
			return state.update('showPreloginService', value => false);
		default:
			return state;
	}
};

export default activationGuide;
