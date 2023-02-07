import Promise from 'bluebird';

import * as PjApi from './pj_api';
import { updatePersonalConfig, loadUserConfigByType } from 'src/client/actions/profile';
import { random } from 'lodash/number';
import { assign, has } from 'lodash/object';
import { forEach } from 'lodash/collection';

export const CHANGE_PAGE = 'CHANGE_PAGE';
export const INIT_INDEX = 'INIT_INDEX';
export const NEXT_INDEX = 'NEXT_INDEX';
export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const TOGGLE_LIGHT_BOX = 'TOGGLE_LIGHT_BOX';

export const pjTypeConfig = '35ddecfc-4368-48f5-9a14-fc7ea6456877';

// 初始化Report頁面
export function initReport(jobcatFromReinitReport, jobcatNameReinitReport) {
	return (dispatch, getState) => {
		const pid = getState().user.pid;
		// 兩個狀況為:
		// 		一、剛進去report頁面時就是拿自己的config
		//    二、點擊future列表所傳的值
		const jobcat = jobcatFromReinitReport || getState().profile.config[pjTypeConfig].value.jobcat;
		const jobcatName = jobcatNameReinitReport || getState().profile.config[pjTypeConfig].value.jobcatName;
		dispatch(requestData());
		// 無法用loadDataCenter的原因是因為getFuture跟reportBrandPjAPI有先後順序，中間loading會有false的時候
		// 就會導致在container job的future先行render導致錯誤，所以需做成客製化等待兩支API打完後loading才轉為false
		dispatch(PjApi.getFuture(jobcat)).then((res) => {
			// 送原本用戶點選的職務為第一個，才會出現在report的上方
			const jobcatIds = [jobcat];
			const jobcatNames = [jobcatName];
			forEach(res.result.children, (value) => {
				jobcatIds.push(value.jobcat);
				jobcatNames.push(value.descript);
			});
			dispatch(PjApi.reportBrandPjAPI({
				// 將陣列拆解成"2013002001,2014002001,2013002003,2004001002,2004001003"這樣的形式
				// API的格式不要問
				jobcatIds: jobcatIds.join() || jobcat,
				jobcatNames: encodeURI(jobcatNames.join()) || encodeURI(jobcatName),
				pid,
				source: 'C'
			})).then(() =>
				dispatch(receiveData(res))
			);
		});
	};
}

// 初始化pj 第一次進入job contianer就會call
export function initPj(query) {
	return (dispatch, getState) => {
		const pid = getState().user.pid;
		Promise.all([
			// 讀取pj的使用者設定檔
			dispatch(loadDataCenter('loadUserConfigByType', {pid, typeList: pjTypeConfig})),
			// 確認pj的狀況
			dispatch(loadDataCenter('checkPjAPI', {pid}))
		]).then(() => {
			const { status } = getState().test.pj.status;
			switch (status) {
				case '1': {
					// 從未作答過 設定隨機SN
					dispatch(readyUpdatePersonlConfig({
						question: random(0, 6),
						part: 1,
						haveReload: false
					}));
					break;
				}
				case '4': {
					break;
				}
				default:
					break;
			}
			// 從C_Plateform來的 判斷要去哪一頁
			// 若沒有作答過是不能到report頁面的
			if (has(query, 'step') && status !== '1') {
				return dispatch(changePage(query.step));
			}
			return dispatch(changePage(redirect(status)));
		});
	};
}

export function reStartPj(dmsDet, jobcat) {
	// 重新測驗
	return (dispatch, getState) => {
		const pid = getState().user.pid;
		const updateData = [{
			pid,
			type: pjTypeConfig,
			value: {
				question: random(0, 6),
				part: 1,
				jobcat: jobcat ? jobcat : '',
				jobcatName: dmsDet ? decodeURI(dmsDet[0].dmsName) : ''
			}
		}];
		dispatch(loadDataCenter(
			'updatePersonalConfig',
			{
				pid: Number(pid),
				updateData: JSON.stringify(updateData)
			})
		).then(() => {
			dispatch(changePage('simple_intro'));
		});
	};
}

// 更新pj的使用者設定檔
export function readyUpdatePersonlConfig({question, part, jobcat, jobcatName, haveReload = true}) {
	return (dispatch, getState) => {
		const pid = getState().user.pid;
		const value = getState().profile.config[pjTypeConfig].value;
		// 會自動補上config原本設定
		// API必須資料都要送齊，不然question跟part會被洗掉
		// 所以當未送資料進來時就自動補上config的資料
		const updateData = [{
			pid,
			type: pjTypeConfig,
			value: {
				question: question || value.question,
				part: part || value.part,
				jobcat: jobcat || value.jobcat,
				jobcatName: jobcatName || value.jobcatName
			}
		}];
		dispatch(loadDataCenter(
			'updatePersonalConfig',
			{
				pid: Number(pid),
				updateData: JSON.stringify(updateData)
			})
		).then(() => {
			// 重刷report頁面
			// 若只有儲存報告的話不重刷
			if (haveReload) {
				dispatch(initReport());
			}
		});
	};
}

function redirect(status) {
	// 1:C端從未作答
	// 2:C端已完成PART4且3個月內
	// 3:C端已完成PART4且超過3個月
	// 4:C端未完成PART4
	switch (status) {
		case '1':
			return 'simple_intro';
		case '2':
			return 'report';
		case '3':
			return 'report';
		case '4':
			return 'report';
		default:
			return '';
	}
}

export function submit(secPage, thisPartAlldatas) {
	// 送出答案
	return (dispatch, getState) => {
		dispatch(requestData());
		const pid = getState().user.pid;
		const { part, question } = getState().profile.config[pjTypeConfig].value;
		let { page } = getState().test.pj;
		const params = {
			pid,
			part,
			custno: 0,
			sex: 0,
			age: 0,
			education: 0,
			eduDepId: 0,
			eduDepName: '+',
			industryId: 0,
			industryName: '+',
			positionId: 0,
			positionName: '+',
			jobId: 0,
			jobName: '+',
			title: '+',
			source: 'C',
			sourceB: 1,
			AnswerId: 0,
			AnswerName: '+',
			snPart1: question,
			same: part
		};
		// part 只有到四
		if (part + 1 === 5) {
			page = 'advanced_done';
		}
		// 當送出答案時清空index好讓下一part從0開始
		dispatch(initIndex());
		// 儲存用戶做到哪一個part，之後從這part開始
		dispatch(readyUpdatePersonlConfig(
			{
				part: part + 1,
				haveReload: false
			}
		));
		switch (page) {
			case 'simple_answer':
				dispatch(changePage('simple_done'));
				break;
			case 'advanced_answer':
				dispatch(changePage('advanced_answer'));
				break;
			case 'advanced_done':
				dispatch(changePage('report'));
				break;
			default:
				break;
		}
		// api就要這麼送的，兩手攤
		// 每頁做答花的時間
		forEach(secPage, (sec, key) => {
			assign(params, {[`secPage${key + 1}`]: sec});
		});
		// 答案分數
		forEach(thisPartAlldatas, (data) => {
			assign(params, {[`q${data.QST_ID}`]: data.point});
		});
		// part中所有使用者填寫的答案是否都一樣
		// 幹這超白癡 媽的這要前端做?
		// 預設給一樣，當第一題答案與其他答案不同時則設為不一樣
		for (let i = 0; i < thisPartAlldatas.length - 1; i += 1) {
			if (thisPartAlldatas[0].point !== thisPartAlldatas[i].point) {
				assign(params, {same: 0});
				break;
			}
		}
		dispatch(loadDataCenter('answerPjAPI', params)).then((res) => {
			// 在simple_done時 lightbox顯示送完answer的結語
			if (part === 1) {
				dispatch(toggleLightbox(true, res.validDesc));
			}
			// 為了更新狀態 進階題目做完時跳回report頁面須更新status
			// 讓上方的【做進階題】按鈕做更新
			dispatch(loadDataCenter('checkPjAPI', {pid}));
			dispatch(receiveData());
		});
	};
}


export function loadDataCenter(apiName, params) {
	return (dispatch, getState) => {
		const state = getState().test.pj;
		if (!state.loading) {
			dispatch(requestData());
		}
		return dispatch(actionMap(apiName)(params)).then((res) => {
			if (isWrong(res)) {
				// error handle
				console.error(`【${apiName}】安安這支API壞掉了喔`);
			} else {
				dispatch(receiveData(res));
			}
			return Promise.resolve(res);
		});
	};
}

export function actionMap(apiName) {
	switch (apiName) {
		case 'checkPjAPI':
			return PjApi.checkPjAPI;
		case 'answerPjAPI':
			return PjApi.answerPjAPI;
		case 'reportBrandPjAPI':
			return PjApi.reportBrandPjAPI;
		case 'getFuture':
			return PjApi.getFuture;
		case 'updatePersonalConfig':
			return updatePersonalConfig;
		case 'loadUserConfigByType':
			return loadUserConfigByType;
		default:
			throw Error(`no match apiName, ${apiName}`);
	}
}

const isWrong = (obj) => {
	if (!obj) return true;
	if (Object.prototype.toString.call(obj) !== '[object Object]') {
		return false;
	}
	return {}.hasOwnProperty.call(obj, 'error') || {}.hasOwnProperty.call(obj, 'warning');
};

export function toggleLightbox(isShow, text) {
	return {
		type: TOGGLE_LIGHT_BOX,
		isShow,
		text
	};
}

export function changePage(page) {
	return (dispatch) => {
		dispatch({
			type: CHANGE_PAGE,
			page
		});
	};
}

export function initIndex() {
	return (dispatch) => {
		dispatch({
			type: INIT_INDEX
		});
	};
}

export function nextIndex(index) {
	return (dispatch) => {
		dispatch({
			type: NEXT_INDEX,
			index
		});
	};
}

const requestData = () => ({
	type: REQUEST_DATA
});

const receiveData = response => ({
	type: RECEIVE_DATA,
	response
});
