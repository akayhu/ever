import { fromJS } from 'immutable';
import { PUBLISH_RESULT_PROCESS } from 'actions/ui/publish';

const initState = fromJS({
	uploadFailedBlocks: {},
});

const PublishReducer = (state = initState, action) => {
	switch (action.type) {
		case PUBLISH_RESULT_PROCESS:
			return state.update('uploadFailedBlocks', value => action.params.blocks);
		default:
			return state;
	}
};

export default PublishReducer;
