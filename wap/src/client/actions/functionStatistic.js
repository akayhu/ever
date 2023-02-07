export const GET_FOLLOWED_LIST = 'GET_FOLLOWED_LIST';
export const GET_MEDIA_LIST = 'GET_MEDIA_LIST';

export function getFollowedList(params) {
	return {
		'CALL_API': {
			type: GET_FOLLOWED_LIST,
			method: 'get',
			target: '/functionStatistic/getFollowedList',
			params: params
		}
	};
}

export function getMediaList(params) {
	return {
		'CALL_API': {
			type: GET_MEDIA_LIST,
			method: 'get',
			target: '/functionStatistic/getMediaList',
			params: params
		}
	};
}
