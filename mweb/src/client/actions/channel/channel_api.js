// 查詢全部頻道列表
export const GET_CHANNEL_LIST = 'GET_CHANNEL_LIST';
export function getChannelList(params) {
	return {
		CALL_API: {
			type: GET_CHANNEL_LIST,
			method: 'get',
			target: '/mediaChannel/getMediaList',
			params
		}
	};
}

// 查詢關注頻道列表
export const GET_SUBSCRIBE_CHANNEL_LIST = 'GET_SUBSCRIBE_CHANNEL_LIST';
export function getSubscribeChannelList(params) {
	return {
		CALL_API: {
			type: GET_SUBSCRIBE_CHANNEL_LIST,
			method: 'get',
			target: '/mediaChannel/getSubscribeMediaList',
			params
		}
	};
}

// 查詢某時間區間有新文章的頻道列表
export const GET_CHANNEL_LIST_BY_NEW_ACTIVITY = 'GET_CHANNEL_LIST_BY_NEW_ACTIVITY';
export function getChannelListByNewActivity(params) {
	return {
		CALL_API: {
			type: GET_CHANNEL_LIST_BY_NEW_ACTIVITY,
			method: 'get',
			target: '/mediaChannel/getMediaListByNewActivity',
			params
		}
	};
}

// 關注頻道
export const SUBSCRIBE_CHANNEL = 'SUBSCRIBE_CHANNEL';
export function subscribeChannel(params) {
	return {
		CALL_API: {
			type: SUBSCRIBE_CHANNEL,
			method: 'post',
			target: '/mediaChannel/subscribeMedia',
			params
		}
	};
}

// 取消關注頻道
export const UN_SUBSCRIBE_CHANNEL = 'UN_SUBSCRIBE_CHANNEL';
export function unsubscribeChannel(params) {
	return {
		CALL_API: {
			type: UN_SUBSCRIBE_CHANNEL,
			method: 'post',
			target: '/mediaChannel/unsubscribeMedia',
			params
		}
	};
}

export const ADD_CHANNEL_ROLE = 'ADD_CHANNEL_ROLE';
export function addChannelRole(params) {
	return {
		CALL_API: {
			type: ADD_CHANNEL_ROLE,
			method: 'post',
			target: '/mediaChannel/addMediaRole',
			params
		}
	};
}

export const DELETE_CHANNEL_ROLE = 'DELETE_CHANNEL_ROLE';
export function deleteChannelRole(params) {
	return {
		CALL_API: {
			type: DELETE_CHANNEL_ROLE,
			method: 'post',
			target: '/mediaChannel/deleteMediaRole',
			params
		}
	};
}

export const GET_CHANNEL_INFO = 'GET_CHANNEL_INFO';
export function getChannelInfo(params) {
	return {
		CALL_API: {
			type: GET_CHANNEL_INFO,
			method: 'get',
			target: '/mediaChannel/getMediaInfo',
			params
		}
	};
}

export const UPDATE_CHANNEL_INFO = 'UPDATE_CHANNEL_INFO';
export function updateChannelInfo(params) {
	return {
		CALL_API: {
			type: UPDATE_CHANNEL_INFO,
			method: 'post',
			target: '/mediaChannel/updateMedia',
			params
		}
	};
}

export const GET_CHANNEL_MEMBER_LIST = 'GET_CHANNEL_MEMBER_LIST';
export function getChannelMemberList(params) {
	return {
		CALL_API: {
			type: GET_CHANNEL_MEMBER_LIST,
			method: 'get',
			target: '/mediaChannel/getMediaMemberList',
			params
		}
	};
}

export const SEARCH_CHANNEL_MEMBER = 'SEARCH_CHANNEL_MEMBER';
export function searchChannelMember(params) {
	return {
		CALL_API: {
			type: SEARCH_CHANNEL_MEMBER,
			method: 'get',
			target: '/mediaChannel/searchMediaMember',
			params
		}
	};
}

export const INVITE_SUBSCRIBE_CHANNEL = 'INVITE_SUBSCRIBE_CHANNEL';
export function inviteSubscribeChannel(params) {
	return {
		CALL_API: {
			type: INVITE_SUBSCRIBE_CHANNEL,
			method: 'post',
			target: '/mediaChannel/inviteSubscribeMedia',
			params
		}
	};
}
