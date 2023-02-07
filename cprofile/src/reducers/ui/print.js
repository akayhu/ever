import Immutable from 'immutable';
import { PRINT_START, PRINT_END } from 'actions/ui/print';

const initState = Immutable.fromJS({
	printStart: false,
	printData: '',
});

const PrintReducer = (state = initState, action) => {
	switch (action.type) {
		case PRINT_START:
			return state
				.update('printStart', value => true)
				.update('printData', value => action.el);
		case PRINT_END:
			return state.update('printStart', value => false);
		default:
			return state;
	}
};

export default PrintReducer;
