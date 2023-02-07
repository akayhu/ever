import * as ssrStatusCodeActionType from 'src/client/actions/ssrStatusCode';

const initState = {
	status: null,
};

export default function ssrStatusCodeReducer(state = initState, action) {
	try {
		switch (action.type) {
			case ssrStatusCodeActionType.CHANGE_SSR_STATUS:
				return Object.assign({}, state, { status: action.statusCode });
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
}
