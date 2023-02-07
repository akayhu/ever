import { CHANGE_CHANNEL_LIST_TAB } from '../../../actions/channel';

export const initState = 'recommend';

const tab = (state = initState, action) => {
	try {
		switch (action.type) {
			case CHANGE_CHANNEL_LIST_TAB:
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
