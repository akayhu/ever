import {
  OPEN_ACTIVITY_LAYER,
  COLSE_ACTIVITY_LAYER,
} from 'src/client/actions/activity';

const initState = {
	aid: '',
	from: '',
	isShow: false,
};

export default function layerActivityReducer(state = initState, action) {
	switch (action.type) {
		case OPEN_ACTIVITY_LAYER:
			return {
				aid: action.aid,
				from: action.from,
				isShow: true,
			};
		case COLSE_ACTIVITY_LAYER:
			return {
				aid: null,
				from: null,
				isShow: false,
			};
		default:
			return state;
	}
}
