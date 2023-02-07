import { CHANGE_CHANNEL_TAB } from '../../../actions/channel';

export const initState = 'admin';

const tab = (state = initState, action) => {
	try {
		switch (action.type) {
			case CHANGE_CHANNEL_TAB:
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
