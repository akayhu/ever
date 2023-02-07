import { combineReducers } from 'redux';
import po from './po';
import pj from './pj';
import { pi } from './pi';

const testReducer = combineReducers({
	pj,
	po,
	pi: pi()
});

export default testReducer;

// export function pj() {
// 	return function pjReducer(state = pjInitState, action) {
// 		try{
// 			switch (action.type) {
// 				case TestActionType.CHECK_PJ_API: {
// 					if (action.response === null) return state;
// 					return Object.assign({}, state, {status: action.response});
// 				}
// 				case TestActionType.ANSWER_PJ_API: {
// 					if (action.response === null) return state;
// 					return Object.assign({}, state, {answer: action.response});
// 				}
// 				case TestActionType.REPORT_BRAND_PJ_API: {
// 					if (action.response === null) return state;
// 					return Object.assign({}, state, {report: action.response});
// 				}
// 				case TestActionType.GET_FUTURE: {
// 					if (action.response === null || !action.response.response) return state;
// 					return Object.assign({}, state, {future: action.response.response});
// 				}
// 				default:
// 					return state;
// 			}
// 		}catch(e){
// 			console.log(e)
// 			return state;
// 		}
// 	};
// }
