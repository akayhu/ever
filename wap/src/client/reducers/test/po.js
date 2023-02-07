import * as TestActionType from '../../actions/test/po';
import { combineReducers } from 'redux';

export default combineReducers({
	page: page(),
	status: status(),
	answer: answer(),
	report: report(),
	lightboxStatus: lightboxStatus()
});

function answer() {
	return function answerReducer(state = [], action) {
		try {
			switch (action.type) {
				case TestActionType.INIT_PO_DATA: {
					return action.data;
				}
				case TestActionType.TOGGLE_IS_CHECKED: {
					return state.map(data => (
						(data.id === action.id)
						? {...data, isChecked: !data.isChecked}
						: data
					));
				}
				case TestActionType.TOGGLE_IS_ANSWERED: {
					return state.map(data => (
						(data.id === action.id)
						? {...data, isAnswered: !data.isAnswered}
						: data
					));
				}
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

function page() {
	return function pageReducer(state = 0, action) {
		try {
			switch (action.type) {
				case TestActionType.NEXT_PAGE: {
					return state + 1;
				}
				case TestActionType.PREV_PAGE: {
					return state - 1;
				}
				case TestActionType.TO_REPORT_PAGE: {
					return 4;
				}
				case TestActionType.TO_ANSWER_PAGE: {
					return 1;
				}
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

function status() {
	return function statusReducer(state = {}, action) {
		try {
			switch (action.type) {
				case TestActionType.CHECK_PO_API: {
					return action.response;
				}
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

function report() {
	return function reportReducer(state = {}, action) {
		try {
			switch (action.type) {
				case TestActionType.REPORT_BRAND_PO_API:
					return action.response;
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

function lightboxStatus() {
	return function showLightboxReducer(state = {}, action) {
		try {
			switch (action.type) {
				case TestActionType.TOGGLE_LIGHT_BOX:
					return { isShow: action.isShow, text: action.text };
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

export function selectPage(state, page) {
	try {
		switch (page) {
			case 1:
				// 第一頁就是全部data
				return state;
			case 2: {
				// 第二頁為第一頁所選到的五項
				const tempState = state.filter(data => (
					data.isChecked
				));
				return tempState;
			}
			case 3: {
				// 第三頁為第一頁未選到的五項
				const tempState = state.filter(data => (
					!data.isChecked
				));
				return tempState;
			}
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
}
