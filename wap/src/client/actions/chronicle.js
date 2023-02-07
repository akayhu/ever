import $ from 'jquery';
// import { UPDATE_SINGLE_PRIVACY } from './privacy';

export const ADDED_CHRONICLE_EXP = 'ADDED_CHRONICLE_EXP';
export const DELETED_CHRONICLE_EXP = 'DELETED_CHRONICLE_EXP';
export const UPDATED_CHRONICLE_EXP = 'UPDATED_CHRONICLE_EXP';
export const LOADED_CHRONICLE_EXP = 'LOADED_CHRONICLE_EXP';

export const ADDED_CHRONICLE_EDU = 'ADDED_CHRONICLE_EDU';
export const DELETED_CHRONICLE_EDU = 'DELETED_CHRONICLE_EDU';
export const UPDATED_CHRONICLE_EDU = 'UPDATED_CHRONICLE_EDU';
export const LOADED_CHRONICLE_EDU = 'LOADED_CHRONICLE_EDU';

export const ADDED_CHRONICLE_HONOR = 'ADDED_CHRONICLE_HONOR';
export const DELETED_CHRONICLE_HONOR = 'DELETED_CHRONICLE_HONOR';
export const UPDATED_CHRONICLE_HONOR = 'UPDATED_CHRONICLE_HONOR';
export const LOADED_CHRONICLE_HONOR = 'LOADED_CHRONICLE_HONOR';

export const LOADED_CHRONICLE = 'LOADED_CHRONICLE';

export const UPDATE_EVENT_PRAVACYSETTING = 'UPDATE_EVENT_PRAVACYSETTING';

export const REMOVE_TITLE_RELATED_TO_EXP = 'REMOVE_TITLE_RELATED_TO_EXP';
export const ALERT_CHECK_EFFECT_LIGHTBOX = 'ALERT_CHECK_EFFECT_LIGHTBOX';

export function loadChronicle(params) {
	return {
		'CALL_API': {
			type: LOADED_CHRONICLE,
			method: 'get',
			target: '/profile/profileChronology/getAllEventList',
			params: params
		}
	};
}

export function loadChronicleExp(params) {
	return {
		'CALL_API': {
			type: LOADED_CHRONICLE_EXP,
			method: 'get',
			target: '/profile/profileChronology/getExpEventList',
			params: params
		}
	};
}

export function loadChronicleEdu(params) {
	return {
		'CALL_API': {
			type: LOADED_CHRONICLE_EDU,
			method: 'get',
			target: '/profile/profileChronology/getEduEventList',
			params: params
		}
	};
}

export function loadChronicleHonor(params) {
	return {
		'CALL_API': {
			type: LOADED_CHRONICLE_HONOR,
			method: 'get',
			target: '/profile/profileChronology/getHonorEventList',
			params: params
		}
	};
}
export function addChronicleExp(params) {
	return (dispatch, getState) => {
		return $.ajax({
			method: 'POST',
			url: '/ajax/profile/profileChronology/createExpEvent',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data: JSON.stringify(params),
			success: (response) => {
				dispatch({
					type: ADDED_CHRONICLE_EXP,
					response
				})
				// if( getState().privacy.experience == 0 && params.privacySetting == 1){
				// 	dispatch({
				// 		type: ALERT_CHECK_EFFECT_LIGHTBOX,
				// 		chronicleClass: 'experience'
				// 	})
				// }
			}
		});
	}
}
export function deleteChronicleExp(params) {
	return {
		'CALL_API': {
			type: DELETED_CHRONICLE_EXP,
			method: 'post',
			target: '/profile/profileChronology/deleteExpEvent',
			params: params
		}
	};
}
export function updateChronicleExp(params) {
	return (dispatch, getState) => {
		params.privacySetting = 1; // phase 2 remember to remove;
		return $.ajax({
			method: 'POST',
			url: '/ajax/profile/profileChronology/updateExpEvent',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data: JSON.stringify(params),
			success: response => {
				dispatch({
					type: UPDATED_CHRONICLE_EXP,
					response
				})
				// if( getState().privacy.experience == 0 && params.privacySetting == 1){
				// 	dispatch({
				// 		type: ALERT_CHECK_EFFECT_LIGHTBOX,
				// 		chronicleClass: 'experience'
				// 	})
				// }
				// if( getState().privacy.experience == 1 && allHideCheck( getState().chronicle.exp ) && params.privacySetting == 0){
				// 	var changePrivacySetting = {
				// 		pid: getState().user.pid,
				// 		privacy: 'experience',
				// 		privacySetting: 0
				// 	}
				// 	updateSinglePrivacyToHide( changePrivacySetting ).then( response => {
				// 		dispatch({
				// 			type: UPDATE_SINGLE_PRIVACY,
				// 			response
				// 		})
				// 	})
				// }
			}
		});
	}
}

export function addChronicleEdu(params) {
	return (dispatch, getState) => {
		return $.ajax({
			method: 'POST',
			url: '/ajax/profile/profileChronology/createEduEvent',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data: JSON.stringify(params),
			success: response => {
				dispatch({
					type: ADDED_CHRONICLE_EDU,
					response
				})
				// if( getState().privacy.education == 0 && params.privacySetting == 1){
				// 	dispatch({
				// 		type: ALERT_CHECK_EFFECT_LIGHTBOX,
				// 		chronicleClass: 'education'
				// 	})
				// }
			}
		});
	}
}
export function deleteChronicleEdu(params) {
	return {
		'CALL_API': {
			type: DELETED_CHRONICLE_EDU,
			method: 'post',
			target: '/profile/profileChronology/deleteEduEvent',
			params: params
		}
	};
}
export function updateChronicleEdu(params) {
	return (dispatch, getState) => {
		params.privacySetting = 1; // phase 2 remember to remove;
		return $.ajax({
			method: 'POST',
			url: '/ajax/profile/profileChronology/updateEduEvent',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data: JSON.stringify(params),
			success: response => {
				dispatch({
					type: UPDATED_CHRONICLE_EDU,
					response
				})
				// if( getState().privacy.education == 0 && params.privacySetting == 1){
				// 	dispatch({
				// 		type: ALERT_CHECK_EFFECT_LIGHTBOX,
				// 		chronicleClass: 'education'
				// 	})
				// }
				// if( getState().privacy.education == 1 && allHideCheck( getState().chronicle.edu ) && params.privacySetting == 0){
				// 	var changePrivacySetting = {
				// 		pid: getState().user.pid,
				// 		privacy: 'education',
				// 		privacySetting: 0
				// 	}
				// 	updateSinglePrivacyToHide( changePrivacySetting ).then( response => {
				// 		dispatch({
				// 			type: UPDATE_SINGLE_PRIVACY,
				// 			response
				// 		})
				// 	})
				// }
			}
		});
	}
}

export function addChronicleHonor(params) {
	return (dispatch, getState) => {
		return $.ajax({
			method: 'POST',
			url: '/ajax/profile/profileChronology/createHonorEvent',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data: JSON.stringify(params),
			success: response => {
				dispatch({
					type: ADDED_CHRONICLE_HONOR,
					response
				})
				// if( getState().privacy.honor == 0 && params.privacySetting == 1){
				// 	dispatch({
				// 		type: ALERT_CHECK_EFFECT_LIGHTBOX,
				// 		chronicleClass: 'honor'
				// 	})
				// }
			}
		});
	}
}
export function deleteChronicleHonor(params) {
	return {
		'CALL_API': {
			type: DELETED_CHRONICLE_HONOR,
			method: 'post',
			target: '/profile/profileChronology/deleteHonorEvent',
			params: params
		}
	};
}
export function updateChronicleHonor(params) {
	return (dispatch, getState) => {
		params.privacySetting = 1; // phase 2 remember to remove;
		return $.ajax({
			method: 'POST',
			url: '/ajax/profile/profileChronology/updateHonorEvent',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			data: JSON.stringify(params),
			success: response => {
				dispatch({
					type: UPDATED_CHRONICLE_HONOR,
					response
				})
				// if( getState().privacy.honor == 0 && params.privacySetting == 1) {
				// 	dispatch({
				// 		type: ALERT_CHECK_EFFECT_LIGHTBOX,
				// 		chronicleClass: 'honor'
				// 	})
				// }
				// if( getState().privacy.honor == 1 && allHideCheck( getState().chronicle.honor ) && params.privacySetting == 0){
				// 	var changePrivacySetting = {
				// 		pid: getState().user.pid,
				// 		privacy: 'honor',
				// 		privacySetting: 0
				// 	};
				// 	updateSinglePrivacyToHide( changePrivacySetting ).then( response => {
				// 		dispatch({
				// 			type: UPDATE_SINGLE_PRIVACY,
				// 			response
				// 		});
				// 	});
				// }
			}
		});
	}
}

export function updateEventPrivacySetting(params) {
	return {
		'CALL_API': {
			type: UPDATE_EVENT_PRAVACYSETTING,
			method: 'post',
			target: '/profile/profileChronology/updateEventPrivacySetting',
			params: params
		}
	};
}

export function removeTitleRelatedToExp(companyName) {
	return {
		type: REMOVE_TITLE_RELATED_TO_EXP,
		companyName: companyName
	};
}

export function alertCheckEffectLightbox(chronicleClass) {
	return{
		type: ALERT_CHECK_EFFECT_LIGHTBOX,
		chronicleClass
	}; // 'none' 為關閉狀態 '學歷' '經歷' '成就'
}

const updateSinglePrivacyToHide = params => {
	return $.ajax({
		method: 'POST',
		url: '/ajax/account/privacy/updateSinglePrivacy',
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		data: JSON.stringify(params)
	});
};

const allHideCheck = (eventArray) => {
	let result = true;
	for (let i = 0, sum = eventArray.length; i < sum; i += 1) {
		if (eventArray[i].privacySetting === 1) result = false;
	}
	return result;
};
