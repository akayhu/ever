import { CHANGE_GROUP_LIST_TAB } from '../../actions/group';

export const initListState = 'knowAndTech';

const tab = (state = initListState, action) => {
	try {
		switch (action.type) {
			case CHANGE_GROUP_LIST_TAB:
				return action.tab;
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
};

export default tab;
