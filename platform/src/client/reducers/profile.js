import * as ProfileActionType from '../actions/profile';

export const initState = {
	config: {},
	user_info: null,
	viewas: 'other',
	viewasInfo: '',
	interactionLock: '',
	user_info_loaded: false
};

export default function profileReducer(state = initState, action){
	try{
		//let res = getResponse(action.response);

		switch(action.type){
			case ProfileActionType.LOAD_USER_CONFIG_BY_TYPE:
				if (action.response === null || !action.response.response) return state;

				if (typeof state.config === 'undefined') {
					state.config = {};
				}

				if (action.response.response[0]) {
					state.config[action.response.response[0].type] = action.response.response[0];
				}

				return  Object.assign({}, state);

			case ProfileActionType.LOADED_USERINFO:
				state.user_info_loaded = true;
				if (action.response === null || !action.response.response) return state;
				return  Object.assign({}, state, {user_info: action.response.response});

			default:
				return state;
		}
	}catch(e){
    console.log(e)
    return state;
  }
};
