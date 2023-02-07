// constants
export const INVITE = 'INVITE';
export const DISCONNECT = 'DISCONNECT';
export const REVOKE = 'REVOKE';
export const ACCEPT = 'ACCEPT';
export const REJECT = 'REJECT';
export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';
export const NOTICE = 'NOTICE';

// action creators
export function invite(params) {
	return {
		CALL_API: {
			type: INVITE,
			method: 'get',
			target: '/connection/invite',
			params,
		},
	};
}

export function disconnect(params) {
	return {
		CALL_API: {
			type: DISCONNECT,
			method: 'post',
			target: '/connection/disconnect',
			params,
		},
	};
}

export function revoke(params) {
	return {
		CALL_API: {
			type: REVOKE,
			method: 'get',
			target: '/connection/revoke',
			params,
		},
	};
}

export function accept(params) {
	return {
		CALL_API: {
			type: ACCEPT,
			method: 'get',
			target: '/connection/accept',
			params,
		},
	};
}

export function reject(params) {
	return {
		CALL_API: {
			type: REJECT,
			method: 'get',
			target: '/connection/reject',
			params,
		},
	};
}

export function subscribe(params) {
	return {
		CALL_API: {
			type: SUBSCRIBE,
			method: 'get',
			target: '/connection/subscribe',
			params,
		},
	};
}

export function unsubscribe(params) {
	return {
		CALL_API: {
			type: UNSUBSCRIBE,
			method: 'get',
			target: '/connection/unsubscribe',
			params,
		},
	};
}

export function notice(params) {
	return {
		CALL_API: {
			type: NOTICE,
			method: 'get',
			target: '/connection/notice',
			params,
		},
	};
}
