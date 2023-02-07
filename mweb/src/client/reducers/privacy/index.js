import * as PrivacyActionType from '../../actions/privacy';

export const initState = {};

export default function privacyReducer(state = initState, action){
	try{
		let privacy = null;
	
		switch(action.type){
			case PrivacyActionType.QUERY_PRIVACY_INFO:
				if (action.response === null) return state;
				privacy = action.response.response;
				return Object.assign( {}, state,  privacy  );

			case PrivacyActionType.ISALLOWREADPROFILE:
				if (action.response === null) return state;
				return Object.assign( {}, state,  action.privacy  );

			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};
