import * as PrivacyActionType from '../actions/privacy';

const initState = {
	loading: false
};

export default function privacyReducer(state = initState, action) {
	try {
		switch (action.type) {
			case PrivacyActionType.SET_PRIVACY:
				return {...state, ...action.privacy};
			case PrivacyActionType.REQUEST_DATA:
				return {...state, loading: true};
			case PrivacyActionType.RECEIVE_DATA:
				return {...state, ...action.response, loading: false};
			default:
				return state;
		}
	} catch (e) {
		console.error(e);
		return state;
	}
}


// export const initState = {};
//
// export default function privacyReducer(state = initState, action) {
// 	try {
// 		switch (action.type) {
// 			case PrivacyActionType.SET_PRIVACY:
// 				return Object.assign({}, state, action.privacy);
// 			case PrivacyActionType.QUERY_PRIVACY_INFO:
// 				if (action.response === null || !action.response.response) return state;
// 				return Object.assign({}, state, action.response.response);
// 			case PrivacyActionType.UPDATE_PRIVACY:
// 				if (action.response === null || !action.response.response) return state;
// 				return Object.assign({}, state, action.response.response);
// 			case PrivacyActionType.UPDATE_SINGLE_PRIVACY:
// 				if (action.response === null || !action.response.response) return state;
// 				return Object.assign({}, state, action.response.response);
// 			case PrivacyActionType.GETMEMBERIDENTITYLIST:
// 				if (action.response === null || !action.response.response) return state;
// 				return Object.assign({}, state, action.response.response);
// 			case PrivacyActionType.ISALLOWREADPROFILE:
// 				return Object.assign({}, state, action.privacy);
// 			default:
// 				return state;
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		return state;
// 	}
// }
