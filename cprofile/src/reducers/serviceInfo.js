import { fromJS } from 'immutable';
import {
	GET_RECIEVE_FETCH_SERVICE_LIGHTBOX,
	CHANGE_STATUS,
} from 'actions/serviceInfo';

const initState = fromJS({
	showEditorService: false,
	status: 0,
});

const ShowEditorServiceLightBoxReducer = (state = initState, action) => {
	switch (action.type) {
		case GET_RECIEVE_FETCH_SERVICE_LIGHTBOX:
			return state.update('showEditorService', value => action.payload);
		case CHANGE_STATUS:
			return state.update('status', value => action.payload);
		default:
			return state;
	}
};

export default ShowEditorServiceLightBoxReducer;
