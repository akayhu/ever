import {
  CREATE_WARNING,
  CLOSE_WARNING,
} from 'src/client/actions/warning';

const initState = {
	isShow: false,
	desc: '',
};

export default function warningReducer(state = initState, action) {
	switch (action.type) {
		case CREATE_WARNING:
			return {
				isShow: true,
				desc: action.desc,
			};
		case CLOSE_WARNING:
			return {
				isShow: false,
				desc: '',
			};
		default:
			return state;
	}
}
