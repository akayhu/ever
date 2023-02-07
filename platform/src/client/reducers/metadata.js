import * as metadataActions from '../actions/metadata';

export const initState = {};

export default function metadataReducer(state = initState, action){
	try{
		switch(action.type){
			case metadataActions.SET_METADATA: {
				return {
					...state, 
					[action.key]: action.value
				};
			}
			
			default:
				return state;
		}
	}catch(e){
    console.log(e)
    return state;
  }
};
