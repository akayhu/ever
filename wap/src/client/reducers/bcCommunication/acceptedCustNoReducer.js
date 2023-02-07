import * as BCCommunicationActionType from '../../actions/bcCommunication';

export const initState = [];

export default function acceptedCustNoReducer(state = initState, action) {
	try{
		switch (action.type) {
			case BCCommunicationActionType.ADD_ACCEPT_CUST_NO:
				return [...state, action.payload];
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
