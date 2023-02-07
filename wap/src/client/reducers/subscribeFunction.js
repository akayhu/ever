import {
	GET_SUBSCRIBE_LIST,
	SUBSCRIBE,
	UNSUBSCRIBE} from '../actions/topic';

export const initState = {
	subscribeInfo: []
};

export default function subscribeFunctionReducer(state = initState, action){
	try{
		switch(action.type){
			case GET_SUBSCRIBE_LIST:
				if (action.response === null || !action.response.response) return state;
				return Object.assign( {}, state,  { subscribeInfo: action.response.response });

			case SUBSCRIBE:
				if (action.response === null || !action.response.response) return state;
				return Object.assign( {}, state,  action.response.response  );

			case UNSUBSCRIBE:
				if (action.response === null || !action.response.response) return state;
				return Object.assign( {}, state,  action.response.response  );

			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};
