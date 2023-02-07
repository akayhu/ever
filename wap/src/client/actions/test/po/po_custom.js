import Promise from 'bluebird';
import { answerPoAPI, checkPoAPI } from './po_api';
import { has } from 'lodash/object';

export const INIT_PO_DATA = 'INIT_PO_DATA';
export const TOGGLE_IS_CHECKED = 'TOGGLE_IS_CHECKED';
export const TOGGLE_IS_ANSWERED = 'TOGGLE_IS_ANSWERED';
export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';
export const TO_REPORT_PAGE = 'TO_REPORT_PAGE';
export const TO_ANSWER_PAGE = 'TO_ANSWER_PAGE';
export const TOGGLE_LIGHT_BOX = 'TOGGLE_LIGHT_BOX';

export function randomPoData(data) {
	return (dispatch, getState) => {
		function randomArray(data) {
			const array = [];
			for (const i in data) {
				array.push({
					id: i,
					text: data[i],
					isChecked: false,
					isAnswered: false
				});
			}
			for (let i = array.length - 1; i > 0; i--) { // 做隨機排序
				const j = Math.floor(Math.random() * (i + 1));
				const temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		}
		return dispatch(initPoData(randomArray(data)));
	};
}

export function readyCheckPoAPI(params, query) {
	return (dispatch, getState) => {
		dispatch(checkPoAPI(params)).then((res) => {
			const { status } = res;
			// 從C_Plateform來的 判斷要去哪一頁
			// 若沒有作達過是不能到report頁面的
			if (has(query, 'step') && status !== 1) {
				switch (query.step) {
					case 'answer':
						return dispatch(toAnswerPage());
					case 'report':
						return dispatch(toReportPage());
					default:
						return null;
				}
			}
			if (status !== 1 && status) {
				dispatch(toReportPage());
			} else if (status === 1) {
				dispatch(toAnswerPage());
			}
		});
	};
}

export function readyAnswerPoAPI() { // 整併送出answerPoAPI的資料
	return (dispatch, getState) => {
		const pid = getState().user.pid;
		const answers = getState().test.po.answer;
		let params = {
			pid,
			custno: 0,
			jobIndustryId: 1001000000,
			role: 1,
			sex: 0,
			age: 0,
			education: 11,
			eduDepId: 0,
			eduDepName: '+',
			industryId: 0,
			industryName: '+',
			positionId: 0,
			positionName: '+',
			title: '+',
			source: 'C',
			send: '測試送答案到API'
		};
		for (const answer of answers) { // 整併要送API的DATA
			params = Object.assign(
				{},
				params,
				{
					[`OC${padLeft(Number(answer.id) + 1, 2)}`]:
					selectValue(answer.isChecked, answer.isAnswered)
				}
			);
		}
		dispatch(nextPage());
		dispatch(answerPoAPI(params));
	};
}

function selectValue(isChecked, isAnswered) { // 填數字
	if (isChecked && isAnswered) {
		return 4;
	} else if (isChecked && !isAnswered) {
		return 3;
	} else if (!isChecked && isAnswered) {
		return 1;
	} else if (!isChecked && !isAnswered) {
		return 2;
	}
	return 0;
}

function padLeft(str, max) { // 數字補零
	if (String(str).length >= max) {
		return String(str);
	}
	return padLeft(`0${str}`, max);
}

export function nextPage() {
	return (dispatch, getState) => {
		const page = getState().test.po.page;
		const answers = getState().test.po.answer;
		let count = 0;
		switch (page) {
			case 1: // 第一頁要到第二頁時 做勾選數量驗證
				answers.forEach((answer) => {
					if (answer.isChecked) {
						count += 1;
					}
				});
				if (count !== 5) {
					return dispatch(toggleLightbox(true, '請挑選五個期望的組織特性'));
				}
				break;
			case 2: // 第二頁要到第三頁時 做勾選數量驗證
				answers.forEach((answer) => {
					if (answer.isChecked && answer.isAnswered) {
						count += 1;
					}
				});
				if (count !== 2) {
					return dispatch(toggleLightbox(true, '請挑選兩個最期望的組織特性'));
				}
				break;
			case 3: // 第三頁要到報表頁時 做勾選數量驗證
				answers.forEach((answer) => {
					if (!answer.isChecked && answer.isAnswered) {
						count += 1;
					}
				});
				if (count !== 2) {
					return dispatch(toggleLightbox(true, '請挑選兩個最不期望的組織特性'));
				}
				break;
			default:
				break;
		}
		return dispatch({
			type: NEXT_PAGE,
			page
		});
	};
}

export function toggleLightbox(isShow, text) {
	return {
		type: TOGGLE_LIGHT_BOX,
		isShow,
		text
	};
}

export function prevPage() {
	return (dispatch, getState) => {
		const page = getState().test.po.page;
		dispatch({
			type: PREV_PAGE,
			page
		});
	};
}

export function toReportPage() {
	return {
		type: TO_REPORT_PAGE
	};
}

export function toAnswerPage() {
	return {
		type: TO_ANSWER_PAGE
	};
}

export function toggleIsChecked(id, isChecked) {
	return {
		type: TOGGLE_IS_CHECKED,
		id,
		isChecked
	};
}

export function toggleIsAnswered(id, isAnswered) {
	return {
		type: TOGGLE_IS_ANSWERED,
		id,
		isAnswered
	};
}

export function initPoData(data) {
	return {
		type: INIT_PO_DATA,
		data
	};
}
