"use strict";
import { getInviteData, getBubbleCount } from '../reducers/navigation/selectors';

//取得邀請列表
export function triggerGetInviteList(params) {
	return (dispatch, getState) => {
		// 泡泡===0 且 已有資料 就不打api
		if (!getBubbleCount(getState(), 'connectionBubbleCount') && getInviteData(getState()).length) return;

		dispatch(getInviteList(params));
	}
}

export const GET_INVITE_LIST = '[PF]GET_INVITE_LIST';
export function getInviteList(params) {
	return {
		'CALL_API': {
			type: GET_INVITE_LIST,
			method: 'get',
			target: '/connection/getInviteList',
			params: params
		}
	};
}

//接受交換名片
export const CONNECTION_ACCEPT = '[PF]CONNECTION_ACCEPT';
export function connectionAccept(params) {
	return {
		'CALL_API': {
			type: CONNECTION_ACCEPT,
			method: 'get',
			target: '/connection/accept',
			params: params
		}
	};
}

//拒絕交換名片
export const CONNECTION_REJECT = '[PF]CONNECTION_REJECT';
export function connectionReject(params) {
	return {
		'CALL_API': {
			type: CONNECTION_REJECT,
			method: 'get',
			target: '/connection/reject',
			params: params
		}
	};
}

//邀請交換名片
export const CONNECTION_INVITE = 'CONNECTION_INVITE';
export function connectionInvite(params) {
	return {
		'CALL_API': {
			type: CONNECTION_INVITE,
			method: 'get',
			target: '/connection/invite',
			params: params
		}
	};
}

//關注對方
export const CONNECTION_SUBSCRIBE = 'CONNECTION_SUBSCRIBE';
export function connectionSubscribe(params) {
	return {
		'CALL_API': {
			type: CONNECTION_SUBSCRIBE,
			method: 'get',
			target: '/connection/subscribe',
			params: params
		}
	};
}
