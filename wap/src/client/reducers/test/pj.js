import * as TestActionType from '../../actions/test/pj';
import { combineReducers } from 'redux';
import { has } from 'lodash/object';

export default combineReducers({
	page: page(),
	index: index(),
	status: status(),
	loading: loading(),
	report: report(),
	future: future(),
	lightboxStatus: lightboxStatus()
});

function page() {
	// page 總共有:
	// simple_intro(簡易版指導頁)
	// simple_answer(簡易版作答頁)
	// simple_done(簡易版完成畫面)
	// report(報告頁)
	// advanced_intro(進階版指導頁)
	// advanced_answer(進階版作答頁)
	return function pageReducer(state = '', action) {
		try {
			switch (action.type) {
				case TestActionType.CHANGE_PAGE: {
					return action.page;
				}
				default:
					return state;
			}
		} catch (e) {
			console.error(e);
			return state;
		}
	};
}

function index() {
	return function indexReducer(state = 0, action) {
		try {
			switch (action.type) {
				case TestActionType.NEXT_INDEX: {
					return state + 1;
				}
				case TestActionType.CHANGE_PAGE:
				case TestActionType.INIT_INDEX:
					return 0;
				default:
					return state;
			}
		} catch (e) {
			console.error(e);
			return state;
		}
	};
}

function status() {
	return function statusReducer(state = {}, action) {
		try {
			switch (action.type) {
				case TestActionType.CHECK_PJ_API: {
					return action.response;
				}
				default:
					return state;
			}
		} catch (e) {
			console.error(e);
			return state;
		}
	};
}

function loading() {
	return function loadingReducer(state = false, action) {
		try {
			switch (action.type) {
				case TestActionType.REQUEST_DATA: {
					return true;
				}
				case TestActionType.RECEIVE_DATA: {
					return false;
				}
				default:
					return state;
			}
		} catch (e) {
			console.error(e);
			return state;
		}
	};
}

function report() {
	return function reportReducer(state = {}, action) {
		try {
			switch (action.type) {
				case TestActionType.REPORT_BRAND_PJ_API:
					return action.response;
				default:
					return state;
			}
		} catch (e) {
			console.error(e);
			return state;
		}
	};
}

function future() {
	return function futureReducer(state = [], action) {
		try {
			switch (action.type) {
				case TestActionType.GET_FUTURE:
					// 由於future回應沒一致，有空陣列或null
					return action.res.result.children || [];
				default:
					return state;
			}
		} catch (e) {
			console.error(e);
			return state;
		}
	};
}

function lightboxStatus() {
	return function lightboxStatusReducer(state = {}, action) {
		try {
			switch (action.type) {
				case TestActionType.TOGGLE_LIGHT_BOX:
					return { isShow: action.isShow, text: action.text };
				default:
					return state;
			}
		} catch (e) {
			console.error(e);
			return state;
		}
	};
}

export function getConfig(config, type) {
	return has(config, type) ? config[type].value : {};
}
