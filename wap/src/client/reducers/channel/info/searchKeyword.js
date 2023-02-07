import { TRIGGET_SEARCH, CLEAR_SEARCH } from '../../../actions/channel';

export const initState = '';

const searchText = (state = '', action) => {
	try {
		switch (action.type) {
			case TRIGGET_SEARCH:
				return action.text;
			case CLEAR_SEARCH:
				return initState;
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
};

export default searchText;
