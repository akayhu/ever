"use strict";

//import * as aaa from "./testtest";

export const LOCK_CLEAR = 'LOCK_CLEAR';
export function lockClear() {
	return {
		type: LOCK_CLEAR
	};
}

export const CLEAR_ALERT = 'CLEAR_ALERT';
export function clearAlert(elemId) {
	return {
		type: CLEAR_ALERT,
		elemId: elemId
	};
}

export const SHOW_ALERT = 'SHOW_ALERT';
export function showAlert(code, title, message) {
	return {
		type: SHOW_ALERT,
		code: code,
		title: title,
		message: message
	};
}

export const SET_DIRECT_PANEL = 'SET_DIRECT_PANEL';
export function setDirectPanel(show) {
	return {
		type: SET_DIRECT_PANEL,
		show
	};
}
/**
 * 自訂alert lightbox
 */
export const CREATE_ALERT = 'CREATE_ALERT';
export const CLOSE_ALERT = 'CLOSE_ALERT';

export function createAlert(params) {
    return {
        type: CREATE_ALERT,
        desc: params.desc
    }
}

export function closeAlert() {
    return {
        type: CLOSE_ALERT
    }
}