"use strict";

export const CHECK_PJ_API = 'CHECK_PJ_API';
export function checkPjAPI(params) {
	return {
		'CALL_API': {
			type: CHECK_PJ_API,
			method: 'get',
			target: '/test/checkPjAPI',
			params: params
		}
	};
}

export const CHECK_PO_API = 'CHECK_PO_API';
export function checkPoAPI(params) {
	return {
		'CALL_API': {
			type: CHECK_PO_API,
			method: 'get',
			target: '/test/checkPoAPI',
			params: params
		}
	};
}

export const CHECK_PI_API = 'CHECK_PI_API';
export function checkPiAPI(params) {
	return {
		'CALL_API': {
			type: CHECK_PI_API,
			method: 'get',
			target: '/test/checkPiAPI',
			params: params
		}
	};
}