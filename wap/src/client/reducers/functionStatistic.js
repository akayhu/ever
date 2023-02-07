import * as FunctionStatisticType from '../actions/functionStatistic';

export const initState = {
	followedList: {
		offset:0,
		total: 0,
		hasNext: false,
		dataList: []
	},		
	mediaList: {
		offset:0,
		total: 0,
		hasNext: false,
		dataList: []
	}
};

export default function functionStatisticReducer(state = initState, action){
	try{
		switch(action.type){
			case FunctionStatisticType.GET_FOLLOWED_LIST:
				if (action.response === null || !action.response.response) return state;
				return Object.assign( {}, state,  { followedList: action.response.response });

			case FunctionStatisticType.GET_MEDIA_LIST:
				if (action.response === null || !action.response.response) return state;
				return Object.assign( {}, state,  { mediaList: action.response.response });

			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};
