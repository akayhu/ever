import {requestData, receiveData, receiveCount, receiveFail} from './queryTool';

/**
 * 對文章加上肯定
 */
export const BROADCAST_CREATE_ENDORSE = 'BROADCAST_CREATE_ENDORSE';
export const broadcastCreateEndorse = (endorse, activity, params) => receiveData(BROADCAST_CREATE_ENDORSE, endorse, activity, params);

/**
 * 對文章刪除肯定
 */
export const BROADCAST_DELETE_ENDORSE = 'BROADCAST_DELETE_ENDORSE';
export const broadcastDeleteEndorse = (endorse, activity, params) => receiveData(BROADCAST_DELETE_ENDORSE, endorse, activity, params);

/**
 * 新增肯定
 */
export const ADD_ENDORSEMENT = 'ADD_ENDORSEMENT';
export const addEndorsement = (activity, endorseItem) => (dispatch, getState) => {
	const fakeEndorse = {
		item: endorseItem.item,
		count: 1,
		endorseIt: true
	};

	dispatch(broadcastCreateEndorse(fakeEndorse, activity, {user: getState().user}));
	return dispatch({
		CALL_API: {
			type: ADD_ENDORSEMENT,
			method: 'post',
			target: '/activity/addEndorse',
			params: {
				aid: activity.aid,
				authorPid: activity.userInfo.pid,
				item: endorseItem.item
			}
		}
	}).then((response) => {
		if (!response.response) {
			return dispatch(receiveFail(ADD_ENDORSEMENT, response));
		}
	});
};

/**
 * 刪除肯定(觀看者)
 */
export const DELETE_ENDORSEMENT = 'DELETE_ENDORSEMENT';
export const deleteEndorsement = (activity, endorseItem) => (dispatch, getState) => {
	const fakeEndorse = {
		item: endorseItem.item,
		count: endorseItem.count - 1,
		endorseIt: false
	};

	dispatch(broadcastDeleteEndorse(fakeEndorse, activity, {user: getState().user}));
	return dispatch({
		CALL_API: {
			type: DELETE_ENDORSEMENT,
			method: 'post',
			target: '/activity/delEndorser',
			params: {
				aid: activity.aid,
				item: endorseItem.item
			}
		}
	}).then((response) => {
		if (!response.response) {
			return dispatch(receiveFail(DELETE_ENDORSEMENT, response));
		}
	});
};

/**
 * 刪除肯定(作者)
 */
export const DELETE_ENDORSEMENT_ITEMS = 'DELETE_ENDORSEMENT_ITEMS';
export const deleteEndorsementItem = (activity, endorseItem) => (dispatch, getState) => {
	const fakeEndorse = {
		item: endorseItem.item,
		count: endorseItem.count,
		endorseIt: false,
		forceDelete: true
	};

	dispatch(broadcastDeleteEndorse(fakeEndorse, activity, {user: getState().user}));
	return dispatch({
		CALL_API: {
			type: DELETE_ENDORSEMENT,
			method: 'post',
			target: '/activity/delEndorseItems',
			params: {
				aid: activity.aid,
				item: endorseItem.item
			}
		}
	}).then((response) => {
		if (!response.response) {
			return dispatch(receiveFail(DELETE_ENDORSEMENT_ITEMS, response));
		}
	});
}
;