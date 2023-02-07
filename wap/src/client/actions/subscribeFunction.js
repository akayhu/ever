export const GET_SUBSCRIBE_LIST = 'GET_SUBSCRIBE_LIST';
export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';

export function getSubscribeList(params) {
	return {
		'CALL_API': {
			type: GET_SUBSCRIBE_LIST,
			method: 'get',
			target: '/topic/subscribeFunction/getSubscribeList',
			params: params
		}
	};
}

export function subscribe(params) {
	return {
		'CALL_API': {
			type: SUBSCRIBE,
			method: 'get',
			target: '/topic/subscribeFunction/subscribe',
			params: params
		}
	};
}

export function unsubscribe(params) {
	return {
		'CALL_API': {
			type: UNSUBSCRIBE,
			method: 'get',
			target: '/topic/subscribeFunction/unsubscribe',
			params: params
		}
	};
}