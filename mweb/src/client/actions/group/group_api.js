// constatns
export const QUERY_GROUP_CATEGORY_LIST = 'QUERY_GROUP_CATEGORY_LIST';
export const QUERY_GROUP_LIST_BY_CATEGORY = 'QUERY_GROUP_LIST_BY_CATEGORY';
export const GET_MY_GROUP_INIT_DATA = 'GET_MY_GROUP_INIT_DATA';
export const QUERY_JOINED_GROUP_LIST = 'QUERY_JOINED_GROUP_LIST';
export const QUERY_WAIT_FOR_JOIN_GROUP_LIST = 'QUERY_WAIT_FOR_JOIN_GROUP_LIST';
export const QUERY_MANAGED_GROUP_LIST_BY_STATUS = 'QUERY_MANAGED_GROUP_LIST_BY_STATUS';
export const GET_GROUP_INFO = 'GET_GROUP_INFO';
export const QUERY_GROUP_MEMBER_LIST = 'QUERY_GROUP_MEMBER_LIST';
export const APPLY_JOIN_GROUP = 'APPLY_JOIN_GROUP';
export const CANCEL_APPLY_JOIN = 'CANCEL_APPLY_JOIN';
export const LEAVE_GROUP = 'LEAVE_GROUP';
export const SET_NOTICE_STATUS = 'SET_NOTICE_STATUS';

// action creators
export const queryGroupCategoryList = params => ({
	CALL_API: {
		type: QUERY_GROUP_CATEGORY_LIST,
		method: 'get',
		target: '/group/queryGroupCategoryList',
		params,
	},
});

export const getMyGroupInitData = params => ({
	CALL_API: {
		type: GET_MY_GROUP_INIT_DATA,
		method: 'get',
		target: '/group/getMyGroupInitData',
		params,
	},
});

export const queryGroupListByCategory = params => ({
	CALL_API: {
		type: QUERY_GROUP_LIST_BY_CATEGORY,
		method: 'get',
		target: '/group/queryGroupListByCategory',
		params
	},
});

export const queryJoinedGroupList = params => ({
	CALL_API: {
		type: QUERY_JOINED_GROUP_LIST,
		method: 'get',
		target: '/group/queryJoinedGroupList',
		params
	}
});

export const queryWaitForJoinGroupList = params => ({
	CALL_API: {
		type: QUERY_WAIT_FOR_JOIN_GROUP_LIST,
		method: 'get',
		target: '/group/queryWaitForJoinGroupList',
		params
	}
});

export const queryManageGroupListByStatus = params => ({
	CALL_API: {
		type: QUERY_MANAGED_GROUP_LIST_BY_STATUS,
		method: 'get',
		target: '/group/queryManageGroupListByStatus',
		params
	}
});

export const getGroupInfo = params => ({
	CALL_API: {
		type: GET_GROUP_INFO,
		method: 'get',
		target: '/group/getGroupInfo',
		params
	}
});

export const queryGroupMemberList = params => ({
	CALL_API: {
		type: QUERY_GROUP_MEMBER_LIST,
		method: 'get',
		target: '/group/queryGroupMemberList',
		params
	}
});

export function applyJoinGroup(params) {
	return {
		'CALL_API': {
			type: APPLY_JOIN_GROUP,
			method: 'get',
			target: '/group/applyJoinGroup',
			params: params
		}
	};
}

export function setNoticeStatus(params) {
	return {
		CALL_API: {
			type: SET_NOTICE_STATUS,
			method: 'get',
			target: '/group/setNoticeStatus',
			params
		}
	};
}

export function leaveGroup(params) {
	return {
		'CALL_API': {
			type: LEAVE_GROUP,
			method: 'post',
			target: '/group/leaveGroup',
			params: params
		}
	};
}

export function cancelApplyJoin(params) {
	return {
		'CALL_API': {
			type: CANCEL_APPLY_JOIN,
			method: 'get',
			target: '/group/cancelApplyJoin',
			params: params
		}
	};
}