// constants
export const APPLY_GROUP = 'APPLY_GROUP';
export const QUERY_GROUP_LIST_BY_CREATOR = 'QUERY_GROUP_LIST_BY_CREATOR';
export const GET_MY_GROUP_INIT_DATA = 'GET_MY_GROUP_INIT_DATA';

export const GET_EMAIL_INFO_BY_PID = 'GET_EMAIL_INFO_BY_PID';
export const UPDATE_GROUP = 'UPDATE_GROUP';
export const DELETE_APPLY_GROUP = 'DELETE_APPLY_GROUP';
export const GET_GROUP_INFO = 'GET_GROUP_INFO';
export const QUERY_GROUP_LIST_BY_CATEGORY = 'QUERY_GROUP_LIST_BY_CATEGORY';
export const QUERY_JOINED_GROUP_LIST = 'QUERY_JOINED_GROUP_LIST';
export const QUERY_WAIT_FOR_JOIN_GROUP_LIST = 'QUERY_WAIT_FOR_JOIN_GROUP_LIST';
export const QUERY_MANAGED_GROUP_LIST_BY_STATUS = 'QUERY_MANAGED_GROUP_LIST_BY_STATUS';
export const QUERY_RECOMMEND_GROUP_LIST = 'QUERY_RECOMMEND_GROUP_LIST';
export const QUERY_GROUP_LIST_BY_NEW_ACTIVITY = 'QUERY_GROUP_LIST_BY_NEW_ACTIVITY';
export const SET_GROUP_HEAD = 'SET_GROUP_HEAD';
export const APPLY_JOIN_GROUP = 'APPLY_JOIN_GROUP';
export const CANCEL_APPLY_JOIN = 'CANCEL_APPLY_JOIN';
export const INVITE_FRIEND = 'INVITE_FRIEND';
export const SET_GROUP_ADMIN = 'SET_GROUP_ADMIN';
export const VERIFY_GROUP_MEMBER ='VERIFY_GROUP_MEMBER';
export const LEAVE_GROUP = 'LEAVE_GROUP';
export const DELETE_GROUP_MEMBER = 'DELETE_GROUP_MEMBER';
export const QUERY_GROUP_MEMBER_LIST = 'QUERY_GROUP_MEMBER_LIST';
export const QUERY_GROUP_ADMIN_LIST = 'QUERY_GROUP_ADMIN_LIST';
export const QUERY_APPLY_LIST = 'QUERY_APPLY_LIST';
export const SEARCH_GROUP_MEMBER = 'SEARCH_GROUP_MEMBER';
export const QUERY_GROUP_CATEGORY_LIST = 'QUERY_GROUP_CATEGORY_LIST';
export const GET_ACTIVITY_LIST_BY_CHANNEL = 'GET_ACTIVITY_LIST_BY_CHANNEL';
export const BATCH_REMOVE_CHANNEL_ACTIVITY = 'BATCH_REMOVE_CHANNEL_ACTIVITY';
// action creators
export function queryGroupListByCategory(params) {
	return {
		'CALL_API': {
			type: QUERY_GROUP_LIST_BY_CATEGORY,
			method: 'get',
			target: '/group/queryGroupListByCategory',
			params: params
		}
	};
}

export function applyGroup(params) {
	return {
		'CALL_API': {
			type: APPLY_GROUP,
			method: 'get',
			target: '/group/applyGroup',
			params: params
		}
	};
}

export function queryGroupListByCreator(params) {
	return {
		'CALL_API': {
			type: QUERY_GROUP_LIST_BY_CREATOR,
			method: 'get',
			target: '/profile/group/queryGroupListByCreator',
			params: params
		}
	};
}

export function queryRecommendGroupList(params) {
	return {
		'CALL_API': {
			type: QUERY_RECOMMEND_GROUP_LIST,
			method: 'get',
			target: '/group/queryRecommendGroupList',
			params: params
		}
	};
}

export function getGroupInfo(params) {
	return {
		'CALL_API': {
			type: GET_GROUP_INFO,
			method: 'get',
			target: '/group/getGroupInfo',
			params: params
		}
	}
}

export function queryJoinedGroupList(params) {
	return {
		'CALL_API': {
			type: QUERY_JOINED_GROUP_LIST,
			method: 'get',
			target: '/group/queryJoinedGroupList',
			params: params
		}
	};
}

export function queryWaitForJoinGroupList(params) {
	return {
		'CALL_API': {
			type: QUERY_WAIT_FOR_JOIN_GROUP_LIST,
			method: 'get',
			target: '/group/queryWaitForJoinGroupList',
			params: params
		}
	};
}

export function queryManageGroupListByStatus(params) {
	return {
		'CALL_API': {
			type: QUERY_MANAGED_GROUP_LIST_BY_STATUS,
			method: 'get',
			target: '/group/queryManageGroupListByStatus',
			params: params
		}
	};
}

export function getMyGroupInitData(params) {
	return {
		'CALL_API': {
			type: GET_MY_GROUP_INIT_DATA,
			method: 'get',
			target: '/group/getMyGroupInitData',
			params: params
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

export function setGroupHead(params) {
	return {
		'CALL_API': {
			type: SET_GROUP_HEAD,
			method: 'get',
			target: '/group/setGroupHead',
			params: params
		}
	};
}

export function updateGroup(params) {
	return {
		'CALL_API': {
			type: UPDATE_GROUP,
			method: 'get',
			target: '/group/updateGroup',
			params: params
		}
	};
}

export function deleteApplyGroup(params) {
	return {
		'CALL_API': {
			type: DELETE_APPLY_GROUP,
			method: 'post',
			target: '/group/deleteApplyGroup',
			params: params
		}
	};
}

export function queryGroupListByNewActivity(params) {
	return {
		'CALL_API': {
			type: QUERY_GROUP_LIST_BY_NEW_ACTIVITY,
			method: 'get',
			target: '/group/queryGroupListByNewActivity',
			params: params
		}
	};
}

export function inviteFriend(params) {
	return {
		'CALL_API': {
			type: INVITE_FRIEND,
			method: 'post',
			target: '/group/inviteFriend',
			params: params
		}
	};
}

export function setGroupAdmin(params) {
	return {
		'CALL_API': {
			type: SET_GROUP_ADMIN,
			method: 'get',
			target: '/group/setGroupAdmin',
			params: params
		}
	};
}

export function verifyGroupMember(params) {
	return {
		'CALL_API': {
			type: VERIFY_GROUP_MEMBER,
			method: 'get',
			target: '/group/verifyGroupMember',
			params: params
		}
	};
}

export function deleteGroupMember(params) {
	return {
		'CALL_API': {
			type: DELETE_GROUP_MEMBER,
			method: 'get',
			target: '/group/deleteGroupMember',
			params: params
		}
	};
}

export function queryGroupMemberList(params) {
	return {
		'CALL_API': {
			type: QUERY_GROUP_MEMBER_LIST,
			method: 'get',
			target: '/group/queryGroupMemberList',
			params: params
		}
	};
}

export function queryGroupAdminList(params) {
	return {
		'CALL_API': {
			type: QUERY_GROUP_ADMIN_LIST,
			method: 'get',
			target: '/group/queryGroupAdminList',
			params: params
		}
	};
}

export function queryApplyList(params) {
	return {
		'CALL_API': {
			type: QUERY_APPLY_LIST,
			method: 'get',
			target: '/group/queryApplyList',
			params: params
		}
	};
}

export function queryGroupCategoryList(params) {
	return {
		'CALL_API': {
			type: QUERY_GROUP_CATEGORY_LIST,
			method: 'get',
			target: '/group/queryGroupCategoryList',
			params: params
		}
	};
}
export function searchGroupMember(params) {
	return {
		'CALL_API': {
			type: SEARCH_GROUP_MEMBER,
			method: 'get',
			target: '/group/searchGroupMember',
			params: params
		}
	}
}
// activity
export function getActivityListByChannel(params) {
	return {
		'CALL_API': {
			type: GET_ACTIVITY_LIST_BY_CHANNEL,
			method: 'get',
			target: '/group/getActivityListByChannel',
			params: params
		}
	}
}
export function batchRemoveChannelActivity(params) {
	return {
		'CALL_API': {
			type: BATCH_REMOVE_CHANNEL_ACTIVITY,
			method: 'get',
			target: '/group/batchRemoveChannelActivity',
			params: params
		}
	}
}
// account
export function getEmailInfoByPid(params) {
	return {
		'CALL_API': {
			type: GET_EMAIL_INFO_BY_PID,
			method: 'get',
			target: '/account/getEmailInfoByPid',
			params: params
		}
	}
}

// notice
export const SET_NOTICE_STATUS = 'SET_NOTICE_STATUS';
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
