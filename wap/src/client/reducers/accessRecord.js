import * as AccessRecordActionType from '../actions/accessRecord';

export const initState = {
	queryViewer: {
		viewerInfo: []
	},
	queryViewerFromPro: {
		comViewerInfo: []
	}
};

export default function accessRecordReducer(state = initState, action) {
	try {
		switch (action.type) {
			case AccessRecordActionType.QUERY_VIEWER:
				if (action.response === null || !action.response.response) return state;
				return Object.assign({}, state, { queryViewer: action.response.response });

			case AccessRecordActionType.QUERY_VIEWER_FROM_PRO:
				if (action.response === null || !action.response.response || action.response.response.length === 0) return state;
				return Object.assign({}, state, { queryViewerFromPro: action.response.response[0] });

			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
}
