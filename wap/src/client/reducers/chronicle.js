import * as ChronicleActionType from '../actions/chronicle';

export const initState = { exp: [], edu: [], honor: [], hintLightbox: 'none' };

function chronicleReducer (state = initState, action) {
	try{
		switch(action.type) {	
			case ChronicleActionType.LOADED_CHRONICLE:

				if( !action.response || action.response.hasOwnProperty('warning') || action.response.hasOwnProperty('error')) return state;

				const chronicledataExp = (action.response.exp.hasOwnProperty('warning'))? [] : action.response.exp;
				const chronicledataEdu = (action.response.edu.hasOwnProperty('warning'))? [] : action.response.edu;
				const chronicledataHonor = (action.response.honor.hasOwnProperty('warning'))? [] : action.response.honor;
				return Object.assign({}, state, { exp: chronicledataExp, edu: chronicledataEdu, honor: chronicledataHonor });
			
			case ChronicleActionType.ADDED_CHRONICLE_EXP:
			case ChronicleActionType.DELETED_CHRONICLE_EXP:
			case ChronicleActionType.UPDATED_CHRONICLE_EXP:
			case ChronicleActionType.LOADED_CHRONICLE_EXP:
				if (action.response === null || !action.response.response) return state;
				if ( !action.response || action.response.hasOwnProperty('error') || action.response.hasOwnProperty('warning')) {
					return state;
				}
				return Object.assign({}, state, { exp: action.response.response || state.exp });
			
			case ChronicleActionType.ADDED_CHRONICLE_EDU:
			case ChronicleActionType.DELETED_CHRONICLE_EDU:
			case ChronicleActionType.UPDATED_CHRONICLE_EDU:
			case ChronicleActionType.LOADED_CHRONICLE_EDU:
				if (action.response === null || !action.response.response) return state;
				if ( !action.response || action.response.hasOwnProperty('error') || action.response.hasOwnProperty('warning')) {
					return state;
				}
				return Object.assign({}, state, { edu: action.response.response || state.edu });
			
			case ChronicleActionType.ADDED_CHRONICLE_HONOR:
			case ChronicleActionType.DELETED_CHRONICLE_HONOR:
			case ChronicleActionType.UPDATED_CHRONICLE_HONOR:
			case ChronicleActionType.LOADED_CHRONICLE_HONOR:
				if (action.response === null || !action.response.response) return state;
				if( !action.response || action.response.hasOwnProperty('error')){
					return state;
				}
				if( !action.response || action.response.hasOwnProperty('warning')){
					return state;
				}
				return Object.assign({}, state, { honor: action.response.response || state.honor });
			
			case ChronicleActionType.UPDATE_EVENT_PRAVACYSETTING:
				return state;
			
			case ChronicleActionType.REMOVE_TITLE_RELATED_TO_EXP:
				const honor = state.honor.map((item) => {
					if (!item.relation) return item;
					if ( item.relation.companyName === action.companyName) {
						item.relation = null;
					}
					return item
				});
				return Object.assign({}, state, { honor });
			
			case ChronicleActionType.ALERT_CHECK_EFFECT_LIGHTBOX:
				return Object.assign({}, state, { hintLightbox: action.chronicleClass })
			
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}


export default chronicleReducer;
