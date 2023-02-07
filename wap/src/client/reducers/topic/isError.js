import {
	REQUEST_DATA,
	GET_DATA,
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
			case GET_DATA: {
				const {key} = action.payload;
				return {...state,
					[key]: false
				};
			}
			case SET_ISERROR: {
				const {key, isError} = action.payload;
				return {...state,
					[key]: isError
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
