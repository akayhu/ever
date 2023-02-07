import { CHANGE_GROUP_TAB } from '../../actions/group';

export const initialState = 'activity';

const groupTab = (state = initialState, action) => {
	try {
		switch (action.type) {
			case CHANGE_GROUP_TAB:
				return action.tab;
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
};

export default groupTab;
