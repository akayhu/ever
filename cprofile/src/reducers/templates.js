import { fromJS } from 'immutable';
import template from 'templates/setting';

const initState = fromJS(template);

const TemplateReducer = (state = initState, action) => {
	switch (action.type) {
		default:
			return state;
	}
};

export default TemplateReducer;
