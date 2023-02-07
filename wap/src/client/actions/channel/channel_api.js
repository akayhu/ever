// 頻道列表頁
export const GET_MEDIA_LIST = 'GET_MEDIA_LIST';
export const GET_SUBSCRIBE_MEDIA_LIST = 'GET_SUBSCRIBE_MEDIA_LIST';
export const SUBSCRIBE_MEDIA = 'SUBSCRIBE_MEDIA';
export const UN_SUBSCRIBE_MEDIA = 'UN_SUBSCRIBE_MEDIA';
export const GET_MEDIA_LIST_BY_NEW_ACTIVITY = 'GET_MEDIA_LIST_BY_NEW_ACTIVITY';

// 權限設定
export const ADD_MEDIA_ROLE = 'ADD_MEDIA_ROLE';
export const DELETE_MEDIA_ROLE = 'DELETE_MEDIA_ROLE';

// 頻道子首頁
export const GET_MEDIA_INFO = 'GET_MEDIA_INFO';
export const UPDATE_MEDIA = 'UPDATE_MEDIA';
// export const GET_ACTIVITY_LIST_BY_CHANNEL_FOR_MEDIA = 'GET_ACTIVITY_LIST_BY_CHANNEL_FOR_MEDIA';

// 頻道成員
export const GET_MEDIA_MEMBER_LIST = 'GET_MEDIA_MEMBER_LIST';
export const SEARCH_MEDIA_MEMBER = 'SEARCH_MEDIA_MEMBER';
export const INVITE_SUBSCRIBE_MEDIA = 'INVITE_SUBSCRIBE_MEDIA';

// 頻道管理員
export const GET_MEDIA_ADMIN_LIST = 'GET_MEDIA_ADMIN_LIST';

// 查詢全部頻道列表
export function getMediaList(params) {
	return {
		CALL_API: {
			type: GET_MEDIA_LIST,
			method: 'get',
			target: '/mediaChannel/getMediaList',
			params
		}
	};
}

// 查詢關注頻道列表
export function getSubscribeMediaList(params) {
	return {
		CALL_API: {
			type: GET_SUBSCRIBE_MEDIA_LIST,
			method: 'get',
			target: '/mediaChannel/getSubscribeMediaList',
			params
		}
	};
}

// 關注頻道
export function subscribeMedia(params) {
	return {
		CALL_API: {
			type: SUBSCRIBE_MEDIA,
			method: 'post',
			target: '/mediaChannel/subscribeMedia',
			params
		}
	};
}

// 取消關注頻道
export function unsubscribeMedia(params) {
	return {
		CALL_API: {
			type: UN_SUBSCRIBE_MEDIA,
			method: 'post',
			target: '/mediaChannel/unsubscribeMedia',
			params
		}
	};
}

// 查詢某時間區間有新文章的頻道列表
export function getMediaListByNewActivity(params) {
	return {
		CALL_API: {
			type: GET_MEDIA_LIST_BY_NEW_ACTIVITY,
			method: 'get',
			target: '/mediaChannel/getMediaListByNewActivity',
			params
		}
	};
}

export function addMediaRole(params) {
	return {
		CALL_API: {
			type: ADD_MEDIA_ROLE,
			method: 'post',
			target: '/mediaChannel/addMediaRole',
			params
		}
	};
}

export function deleteMediaRole(params) {
	return {
		CALL_API: {
			type: DELETE_MEDIA_ROLE,
			method: 'post',
			target: '/mediaChannel/deleteMediaRole',
			params
		}
	};
}

export function getMediaInfo(params) {
	return {
		CALL_API: {
			type: GET_MEDIA_INFO,
			method: 'get',
			target: '/mediaChannel/getMediaInfo',
			params
		}
	};
}

export function updateMedia(params) {
	return {
		CALL_API: {
			type: UPDATE_MEDIA,
			method: 'post',
			target: '/mediaChannel/updateMedia',
			params
		}
	};
}

export function getMediaMemberList(params) {
	return {
		CALL_API: {
			type: GET_MEDIA_MEMBER_LIST,
			method: 'get',
			target: '/mediaChannel/getMediaMemberList',
			params
		}
	};
}

export function getMediaAdminList(params) {
	return {
		CALL_API: {
			type: GET_MEDIA_ADMIN_LIST,
			method: 'get',
			target: '/mediaChannel/getMediaAdminList',
			params
		}
	};
}

export function searchMediaMember(params) {
	return {
		CALL_API: {
			type: SEARCH_MEDIA_MEMBER,
			method: 'get',
			target: '/mediaChannel/searchMediaMember',
			params
		}
	};
}

export function inviteSubscribeMedia(params) {
	return {
		CALL_API: {
			type: INVITE_SUBSCRIBE_MEDIA,
			method: 'post',
			target: '/mediaChannel/inviteSubscribeMedia',
			params
		}
	};
}
