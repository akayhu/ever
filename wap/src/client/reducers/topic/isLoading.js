import {
	REQUEST_DATA,
	GET_DATA,
	GET_INITIAL_DATA,
	SET_ISERROR
} from '../../actions/topic';

export const initalState = {
	news: false,
	followed: false,
	initialEndorse: false,
	initialRelated: false,
	gallery: false,
	initialHonor: false,
	group: false,
	channel: false
};

export default function (state = initalState, action) {
	try {
		switch (action.type) {
			case REQUEST_DATA: {
				const {key} = action.payload;
				return {...state,
					[key]: true
				};
			}
			case GET_DATA:
			case GET_INITIAL_DATA: {
				const {key} = action.payload;
				return {...state,
					[key]: false
				};
			}
			case SET_ISERROR: {
				const {stateKey} = action.payload;
				return {...state,
					[stateKey]: false
				};
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
