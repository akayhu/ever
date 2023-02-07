import {
	POST_DATA,
	POST_SUCCESS,
	POST_FAIL,
	POST_WARNING
} from '../../actions/message';

const initialState = {
	loading: false,
	error: false,
	warning: null
};

export default function postMessage(state = initialState, action) {
	try{
		switch (action.type) {
			case POST_DATA: {
				return {...state,
					loading: true,
					warning: null
				};
			}
			case POST_SUCCESS: {
				return {...state,
					error: false,
					loading: false,
					warning: null
				};
			}
			case POST_WARNING: {
				return {...state,
					error: false,
					loading: false,
					warning: action.response.warning
				};
			}
			case POST_FAIL: {
				return {...state,
					error: false,
					loading: false,
					warning: null
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
