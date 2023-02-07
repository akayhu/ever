import deepAssign from 'deep-assign';
import * as userActions from '../actions/user';

function handleResult(result, defaultState, defaultValue){
	var tempResult = null;

	if(result.hasOwnProperty('response')){
		tempResult = result.response;
	}else{
		tempResult = defaultValue;
	}

	return tempResult;
}

export const initState = {
  pid: -3,
	userName: -3,
	isLogin: false,
	loginTime: 0,
	CS: ""
};

export default function userReducer(state = initState, action){
	try{
		switch(action.type){
			case userActions.LOADED_USER: {
				if (action.response === null || !action.response.response) return state;
				return {...state, ...action.response.response};
			}
			case userActions.GET_AC_USERNAME: {
				if (!action.response || action.response.success !== 'true')
					return state
				return {...state, userName: action.response.data};
			}

			default:
				return state;
		}
	}catch(e){
    console.log(e)
    return state;
  }
};
