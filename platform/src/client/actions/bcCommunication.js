export const GET_MSG_LIST = '[PF]GET_MSG_LIST';
export function getMsgList(params) {
	return {
		'CALL_API': {
			type: GET_MSG_LIST,
			method: 'get',
			target: '/bcCommunication/getMsgList',
			params: params
		}
	};
}
