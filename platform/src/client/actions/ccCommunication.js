export const GET_MESSAGE_LIST = '[PF]GET_MESSAGE_LIST';
export function getMessageList(params) {
	return {
		CALL_API: {
			type: GET_MESSAGE_LIST,
			method: 'get',
			target: '/message/getMessageList',
			params
		}
	};
}
