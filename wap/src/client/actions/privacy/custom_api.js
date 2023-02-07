import Promise from 'bluebird';

import * as PrivacyApi from './privacy_api';

export const SET_PRIVACY = 'SET_PRIVACY';
export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';

export function loadDataCenter(apiName, params) {
	return (dispatch, getState) => {
		const state = getState().privacy;
		if (!state.loading) {
			dispatch(requestData());
		}
		return dispatch(actionMap(apiName)(params)).then((res) => {
			const response = res.response;
			if (isWrong(response)) {
				// error handle
			} else {
				dispatch(receiveData(response));
			}
			return Promise.resolve();
		});
	};
}

export function actionMap(apiName) {
	switch (apiName) {
		case 'queryPrivacyInfo':
			return PrivacyApi.queryPrivacyInfo;
		case 'updateSinglePrivacy':
			return PrivacyApi.updateSinglePrivacy;
		case 'updatePrivacy':
			return PrivacyApi.updatePrivacy;
		case 'getMemberIdentityList':
			return PrivacyApi.getMemberIdentityList;
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

export function setPrivacy(privacy) {
	return {
		type: SET_PRIVACY,
		privacy
	};
}

const requestData = () => ({
	type: REQUEST_DATA
});

const receiveData = response => ({
	type: RECEIVE_DATA,
	response
});


// export function updateSinglePrivacyByHint(){
// 	return (dispatch, getState) => {
// 		var params = {
// 			pid: getState().user.pid,
// 			privacy: getState().chronicle.hintLightbox,
// 			privacySetting: 1
// 		}
// 		return $.ajax({
// 			method: 'POST',
// 			url: '/ajax/account/privacy/updateSinglePrivacy',
// 			contentType: "application/json; charset=utf-8",
// 			dataType: 'json',
// 			data: JSON.stringify( params ),
// 			success: (response) => {
// 				dispatch({
// 					type: UPDATE_SINGLE_PRIVACY,
// 					response
// 				})
// 				dispatch({
// 					type: ALERT_CHECK_EFFECT_LIGHTBOX,
// 					chronicleClass: 'none'
// 				})
// 			}
// 		});
// 	}
// }
