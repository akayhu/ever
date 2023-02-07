export const GET_NOTIFICTION_BY_PID = 'GET_NOTIFICTION_BY_PID';
export function getNotifictionByPid(params) {
	return {
		CALL_API: {
			type: GET_NOTIFICTION_BY_PID,
			method: 'get',
			target: '/notification/getNotifictionByPid',
			params
		}
	};
}
