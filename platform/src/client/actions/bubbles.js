import config from '../../configs/client';
import $ from 'jquery';
import { getBubbleType, isEmpty, mapTypeToApi } from './utils';
export const GET_BUBBLE_COUNT = '[PF]GET_BUBBLE_COUNT';
export const LONG_POLLING = 'LONG_POLLING';
export const SET_BUBBLE_TIME_BY_TYPE = '[PF]SET_BUBBLE_TIME_BY_TYPE';
export const GET_UNREAD_NOTIFY = 'GET_UNREAD_NOTIFY';
export const UPDATE_BUBBLE = 'UPDATE_BUBBLE';
export const CLEAR_BUBBLE = 'CLEAR_BUBBLE';

const { pushServerOne, pushServerTwo, forB, forC } = config.params.push;
const pollingDelay = {};

export function initBubbleData() {
	return dispatch => {
		// 設置long polling
		dispatch(initLongPolling());
		// 拿到初始值
		dispatch(getBubbleCount());
	};
}

export const getBubbleCount = (params) => (dispatch, getState) => {
	return dispatch({
		CALL_API: {
			type: GET_BUBBLE_COUNT,
			method: 'get',
			target: '/notification/getBubbleCount',
			params
		}
	}).then((response) => {
		if (response.response) {
			return dispatch({
				type: GET_BUBBLE_COUNT,
				response: response.response
			});
		} else {
			return dispatch({
				type: GET_BUBBLE_COUNT,
				response: null
			});
		}
	});
}

export function initLongPolling() {
	return (dispatch, getState) => {
		const { pid } = getState().user;
		const urlBc = `${pushServerOne}${forB}_${pid}`;
		const urlCc = `${pushServerOne}${forC}_${pid}`;
		const url_msg = `${pushServerTwo}`;

		poll(dispatch, 'bc', urlBc); // 貴人來敲門 (ppush)
		poll(dispatch, 'cc', urlCc); // 交友 & 舊通知 (ppush)
		dispatch(getUnreadNotify()); // 新通知 (pusher)
		
		$.ajax({
			url: "/ajax/getClientToken",
			success: (result) => {
				if(result) {
					poll(dispatch, 'msg', url_msg, { pid, token: result, cid: 0 }); // 最新訊息 (ppush)
				}
			}
		});
	};
}

export function triggerClickBubble({ type }) {
	return (dispatch, getState) => {
		const targetBubble = getBubbleType(type);
		const dataIsEmpty = isEmpty(type, getState);
		const hasBubbles = getState().navigation.bubbles[targetBubble];
		if(dataIsEmpty || hasBubbles) {
			dispatch(mapTypeToApi(type));
		}
		if(!hasBubbles) return;

		dispatch({
			type: CLEAR_BUBBLE,
			targetBubble
		});
		dispatch(setBubbleTimeByType({ type }));
	};
}

export function setBubbleTimeByType(params) {
	return {
		CALL_API: {
			type: SET_BUBBLE_TIME_BY_TYPE,
			method: 'post',
			target: '/notification/setBubbleTimeByType',
			params
		}
	};
}

export function getUnreadNotify() {
	return {
		CALL_API: {
			type: GET_UNREAD_NOTIFY,
			method: 'get',
			target: '/pusher/getUnreadNotify'
		}
	};
}

function poll(dispatch, category, url, data = {}) {
	if(!pollingDelay.hasOwnProperty(category)) {
		pollingDelay[category] = 5000;
	}
	
	dispatch({
		type: LONG_POLLING,
		category
	});
	
	$.ajax({
		url,
		dataType: 'jsonp',
		data
	}).always((res) => {
		if ((res.hasOwnProperty("statusText") && res.statusText === 'error') || res.hasOwnProperty("error")) {
			pollingDelay[category] += 5000;
		} else {
			updateBubble(res, dispatch);
			pollingDelay[category] = 0;
		}
		
		setTimeout(() => {
			poll(dispatch, category, url, data);
		}, pollingDelay[category]);
	});
}

function updateBubble(data, dispatch) {
	if (Object.prototype.toString.call(data) !== '[object Array]') return;

	const { type, action } = data[0].response;
	const bubbleType = getBubbleType(type, parseInt(action, 10));

	// 若泡泡 type 為 notificationBubbleCount，就不更新泡泡，避免 ppush 和 pusher 兩邊重複累計泡泡數
	if (bubbleType === 'notificationBubbleCount') return;
	dispatch({
		type: UPDATE_BUBBLE,
		targetBubble: bubbleType,
		data: data[0].response
	});
}
