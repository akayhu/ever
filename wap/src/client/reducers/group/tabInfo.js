import { CHANGE_GROUP_LIST_TAB, CHANGE_CATEGORY_TITLE} from '../../actions/group';

export const initListState = {
	main: 'recommend', myGroup: 'joined', complete: 'knowAndTech'
};

const tabInfo = (state = initListState, action) => {
	try {
		switch (action.type) {
			case CHANGE_GROUP_LIST_TAB:
				return Object.assign({}, state, {
					main: action.tab
				});
			case CHANGE_CATEGORY_TITLE:
				return Object.assign({}, state, {
					[state.main]: action.category
				});
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
};

export default tabInfo;
