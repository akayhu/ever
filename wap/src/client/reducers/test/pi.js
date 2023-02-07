import * as TestActionType from '../../actions/test/pi';

const piInitState =	{
	status: {
		status: '1'
	},
	answer: {

	},
	report: {

	}
};

export function pi() {
	return function piReducer(state = piInitState, action) {
		try{
			switch (action.type) {
				case TestActionType.CHECK_PI_API: {
					if (action.response === null) return state;
					return Object.assign({}, state, {status: action.response});
				}
				case TestActionType.ANSWER_PI_API: {
					if (action.response === null) return state;
					return Object.assign({}, state, {answer: action.response});
				}
				case TestActionType.REPORT_BRAND_PI_API: {
					if (action.response === null) return state;
					return Object.assign({}, state, {report: action.response});
				}
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
