import Promise from 'bluebird';
import $ from 'jquery';
import { getIsLoading, getCurrentCount, getIsEnd, getExcellentPeopleListParams } from '../reducers/connection';
import errorHandle from '../../util/errorHandle';

// actions
import c_platform, {actions as CPlatformActions} from 'c_platform';
import { checkIdentity } from './profile';

const CPlatformActionsConnection = CPlatformActions.connection;
// util
const actionMap = (category, getState) => {
	switch (category) {
		case 'friend':
			return loadFriend;
		case 'groupItems':
		  return getGroupItemList;
		case 'invitations':
			return getInviteList;
		case 'unconfirmed':
			return getUnconfirmedInviteList;
		case 'following':
		case 'myfollowers':
		case 'othersfollowers':
			return getFollowList;
		case 'mayKnowPeopleList':
			return getMayKnowPeopleList;
		case 'excellentPeopleList':
			return getExcellentPeopleList;
		case 'mutualFriends':
			return getMutualFriendList;
		case 'nonSelf':
			return getState().privacy.mutualFriend ? loadFriend : getMutualFriendList;
		case 'blockListItem':
			return getBlockList;
		default: // 當category為數字時(groupFriend)會跑default case
			return getGroupMemberList;
	}
};
const parameterMap = (category, getState, otherParams = {}) => {
	const nowState = getState().connection;
	const limit = otherParams.limit || 10;
	let targetPid = otherParams.targetPid;
	if (typeof targetPid === 'undefined') {
		targetPid = getState().profile.watchingProfile;
	}
	
	const offset = (typeof otherParams.offset !== 'undefined') ? otherParams.offset : getCurrentCount(nowState, category, otherParams);
	switch (category) {
		case 'friend':
		case 'nonSelf':
			if (otherParams.hasOwnProperty('all') && otherParams.all === true) {
				return otherParams;
			}

			return {
				targetPid,
				offset,
				limit
			};
		case 'groupItems':
		  return {};
		case 'invitations':
		  return {
			connectionStatus: 2,
			offset,
			limit
		};
		case 'unconfirmed':
			return {
				connectionStatus: 1,
				offset,
				limit
			};
		case 'following':
			return {
				direction: 1,
				targetPid,
				offset,
				limit
			};
		case 'othersfollowers':
		case 'myfollowers':
			return {
				direction: 2,
				targetPid,
				offset,
				limit
			};
		case 'mayKnowPeopleList':
			return {
				offset,
				limit
			};
		case 'excellentPeopleList': {
			const mediaLimit = otherParams.mediaLimit;
			const peopleLimit = otherParams.peopleLimit;
			return {
				mediaLimit: mediaLimit !== undefined ? mediaLimit : limit,
				peopleLimit: peopleLimit !== undefined ? peopleLimit : limit,
				mediaOffset: getExcellentPeopleListParams(nowState).mediaCount,
				peopleOffset: getExcellentPeopleListParams(nowState).peopleCount
			};
		}
		case 'mutualFriends':
			return {
				targetPid: otherParams.targetPid,
				offset,
				limit
			};
		case 'blockListItem': // 一次拿全部
			return {
				limit: 1000,
				offset
			};
		default: // 當category為數字時(groupFriend)會跑default case
			return {
				groupId: category,
				offset,
				limit
			};
	}
};
const isServerError = (res = {}) => res.hasOwnProperty('errorCode');
const isWrong = (obj = {}) => Object.keys(obj).includes('error') || Object.keys(obj).includes('warning');
const canLoad = (state, category, otherParams) => getIsLoading(state, category, otherParams) || getIsEnd(state, category, otherParams);
const hasLoaded = (state, category, otherParams) => !!getCurrentCount(state, category, otherParams) || getIsEnd(state, category, otherParams);

export {CPlatformActionsConnection};

export const GET_CONNECTION_STATUS = 'GET_CONNECTION_STATUS';
export function getConnectionStatus(params) {
	return {
		CALL_API: {
			type: GET_CONNECTION_STATUS,
			method: 'get',
			target: '/connection/getConnectionStatus',
			params
		}
	};
}

export const SET_NON_SELF_LIST = 'SET_NON_SELF_LIST';
export function setNonSelfList(params) {
	return {
		CALL_API: {
			type: SET_NON_SELF_LIST,
			method: 'get',
			target: '/connection/getFriendList',
			params
		}
	};
}

export const SUBSCRIBE = 'SUBSCRIBE';
export function subscribe(params) {
	return {
		CALL_API: {
			type: SUBSCRIBE,
			method: 'get',
			target: '/connection/subscribe',
			params
		}
	};
}

export const UNSUBSCRIBE = 'UNSUBSCRIBE';
export function unsubscribe(params) {
	return {
		CALL_API: {
			type: UNSUBSCRIBE,
			method: 'get',
			target: '/connection/unsubscribe',
			params
		}
	};
}

export const DISCONNECT = 'DISCONNECT';
export function disconnect(params) {
	return {
		CALL_API: {
			type: DISCONNECT,
			method: 'post',
			target: '/connection/disconnect',
			params
		}
	};
}

function extraTask(type, actionObj, category) {
	return dispatch => dispatch(actionObj)
			.then((res) => {
				if (errorHandle(res)) return res;
				const { status } = res.response;
				dispatch({type, category, status});
				return res;
			});
}

export const REJECT = 'REJECT';
export function reject(params, category) {
	const actionObj = {
		CALL_API: {
			type: REJECT,
			method: 'get',
			target: '/connection/reject',
			params,
		}
	};
	if (category) {
		return extraTask(REJECT, actionObj, category);
	}
	return actionObj;
}

export const ACCEPT = 'ACCEPT';
export function accept(params, category) {
	const actionObj = {
		CALL_API: {
			type: ACCEPT,
			method: 'get',
			target: '/connection/accept',
			params,
		}
	};
	if (category) {
		return extraTask(ACCEPT, actionObj, category);
	}
	return actionObj;
}

export const INVITE = 'INVITE';
export function invite(params, category) {
	const actionObj = {
		CALL_API: {
			type: INVITE,
			method: 'get',
			target: '/connection/invite',
			params,
		}
	};
	if (category) {
		return extraTask(INVITE, actionObj, category);
	}
	return actionObj;
}

export const REVOKE = 'REVOKE';
export function revoke(params, category) {
	const actionObj = {
		CALL_API: {
			type: REVOKE,
			method: 'get',
			target: '/connection/revoke',
			params
		}
	};
	if (category) {
		return extraTask(REVOKE, actionObj, category);
	}
	return actionObj;
}

export const NOTICE = 'NOTICE';
export function notice(params) {
	return {
		CALL_API: {
			type: NOTICE,
			method: 'get',
			target: '/connection/notice',
			params
		}
	};
}

export const EXCLUDE = 'EXCLUDE';
export function exclude(params) {
	return {
		CALL_API: {
			type: EXCLUDE,
			method: 'get',
			target: '/connection/exclude',
			params
		}
	};
}

export const GET_EXCLUDE_LIST = 'GET_EXCLUDE_LIST';
export function getExcludeList(params) {
	return {
		CALL_API: {
			type: GET_EXCLUDE_LIST,
			method: 'get',
			target: '/connection/getExcludeList',
			params
		}
	};
}

export const BLOCK = 'BLOCK';
export function block(params) {
	return {
		CALL_API: {
			type: BLOCK,
			method: 'get',
			target: '/connection/block',
			params
		}
	};
}

export const GET_BLOCK_LIST = 'GET_BLOCK_LIST';
export function getBlockList(params) {
	return {
		CALL_API: {
			type: GET_BLOCK_LIST,
			method: 'get',
			target: '/connection/getBlockList',
			params
		}
	};
}

/** *********************************************************************/
/** ********************* CALL_API ***********************/
export const LOADED_FRIEND = 'LOADED_FRIEND';
export function loadFriend(params) {
	return {
		CALL_API: {
			type: LOADED_FRIEND,
			method: 'get',
			target: '/connection/getFriendList',
			params
		}
	};
}


export const LOADED_FRIEND_ALL = 'LOADED_FRIEND_ALL';
export function loadFriendAll() {
	return (dispatch, getState) => {
		const myFriendListInit = getState().global.myFriendList.initStatus;

		if (!myFriendListInit) {
			$.get('/ajax/connection/getAllFriendList', (response) => {
				const mentionList = [];
				$.each(response.response, (index, value) => {
					const item = {
						id: value.pid,
						link: `/profile/${value.pid}`,
						name: value.userName,
						avatar: value.avatarWebUrl
					};
					if (value.hiddenStatus === false) mentionList.push(item);
				});
				dispatch({
					type: LOADED_FRIEND_ALL,
					mentionList
				});
			});
		}
	};
}

export const GET_GROUP_ITEM_LIST = 'GET_GROUP_ITEM_LIST';
export function getGroupItemList(params) {
	return {
		CALL_API: {
			type: GET_GROUP_ITEM_LIST,
			method: 'get',
			target: '/connection/getGroupItemList',
			params
		}
	};
}

export const GET_GROUP_MEMBER_LIST = 'GET_GROUP_MEMBER_LIST';
export function getGroupMemberList(params) {
	return {
		CALL_API: {
			type: GET_GROUP_MEMBER_LIST,
			method: 'get',
			target: '/connection/getGroupMemberList',
			params
		}
	};
}

export const GET_INVITE_LIST = 'GET_INVITE_LIST';
export function getInviteList(params) {
	return {
		CALL_API: {
			type: GET_INVITE_LIST,
			method: 'get',
			target: '/connection/getInviteList',
			params
		}
	};
}

export const GET_UNCONFIRMED_INVITE_LIST = 'GET_UNCONFIRMED_INVITE_LIST';
export function getUnconfirmedInviteList(params) {
	return {
		CALL_API: {
			type: GET_UNCONFIRMED_INVITE_LIST,
			method: 'get',
			target: '/connection/getInviteList',
			params
		}
	};
}

export const LOADED_MY_FOLLOW_LIMIT = 'LOADED_MY_FOLLOW_LIMIT';
export function getMyFollowLimit(params) {
	return {
		CALL_API: {
			type: LOADED_MY_FOLLOW_LIMIT,
			method: 'get',
			target: '/connection/getFollowList',
			params
		}
	};
}

export const GET_FOLLOW_LIST = 'GET_FOLLOW_LIST';
export function getFollowList(params) {
	return {
		CALL_API: {
			type: GET_FOLLOW_LIST,
			method: 'get',
			target: '/connection/getFollowList',
			params
		}
	};
}

export const GET_MAY_KNOW_PEOPLE_LIST = 'GET_MAY_KNOW_PEOPLE_LIST';
export function getMayKnowPeopleList(params) {
	return {
		CALL_API: {
			type: GET_MAY_KNOW_PEOPLE_LIST,
			method: 'get',
			target: '/connection/getMayKnowPeopleList',
			params
		}
	};
}

export const GET_EXCELLENT_PEOPLE_LIST = 'GET_EXCELLENT_PEOPLE_LIST';
export function getExcellentPeopleList(params) {
	return {
		CALL_API: {
			type: GET_EXCELLENT_PEOPLE_LIST,
			method: 'get',
			target: '/connection/getExcellentPeopleList',
			params
		}
	};
}

export const GET_MUTUAL_FRIEND_LIST = 'GET_MUTUAL_FRIEND_LIST';
export function getMutualFriendList(params) {
	return {
		CALL_API: {
			type: GET_MUTUAL_FRIEND_LIST,
			method: 'get',
			target: '/connection/getMutualFriendList',
			params
		}
	};
}

/** ********************* CUSTOMIZED_ACTION ***********************/
export const INIT_CONNECTION_PAGE = 'INIT_CONNECTION_PAGE';
export function initConnectionPage(targetPid) {
	return function (dispatch, getState) {
		const { pid } = getState().user;
		const { viewas } = getState().profile;

		dispatch(clearAll());

		if (viewas !== 'self') {
			return Promise.resolve({nonSelf: true});
		}
		return Promise.all([
			dispatch(loadDataByCategory('groupItems')),
			dispatch(loadDataByCategory('blockListItem'))
		]);
	};
}

export const REQUEST_DATA = 'REQUEST_DATA';
export function requestData(category, otherParams) {
	return {
		type: REQUEST_DATA,
		  category,
		  otherParams
	};
}

export const RECEIVE_DATA = 'RECEIVE_DATA';
export function receiveData(category, response, otherParams) {
	return {
		type: RECEIVE_DATA,
	  category,
	  response,
		otherParams
	};
}

export const RECEIVE_FAIL = 'RECEIVE_FAIL';
export function receiveFail(category, message, otherParams) {
	return {
		type: RECEIVE_FAIL,
	  category,
	  message,
		otherParams
	};
}

export const REACH_END = 'REACH_END';
export function reachEnd(category, otherParams) {
	return {
		type: REACH_END,
	  category,
	  otherParams
	};
}

export const CHANGE_ACTIVE = 'CHANGE_ACTIVE';
export function changeActive(active) {
	return function (dispatch, getState) {
		const state = getState().connection;

		dispatch({
			type: CHANGE_ACTIVE,
			active
		});

		if (active === 'nonSelf') {
			dispatch(clear());
		}

		if (hasLoaded(state, active)) { // 已經載入過或沒資料了就純換頁不載入
	    return Promise.resolve();
	  }

		return dispatch(loadDataByCategory(active));
	};
}

export const constrequestData = 'LOAD_DATA_BY_CATEGORY';
export function loadDataByCategory(category, otherParams) {
	return function (dispatch, getState) {
		const state = getState().connection;

		if (canLoad(state, category, otherParams)) { // 載入中則不重覆發action
		 	return Promise.resolve(); // for return thenable;
		}

		dispatch(requestData(category, otherParams));

		const parameters = parameterMap(category, getState, otherParams);

		return dispatch(actionMap(category, getState)(parameters)).then((res) => {
			const response = res.response;

			if (isServerError(res)) {
				dispatch(receiveFail(category, res, otherParams));
			} else if (isWrong(response)) {
				dispatch(receiveFail(category, response, otherParams));
			} else {
				dispatch(receiveData(category, response, otherParams));
				if (!response.hasNext || category === 'groupItems') {
					dispatch(reachEnd(category, otherParams));
				}
			}
			return Promise.resolve();
		});
	};
}

export const CLEAR = 'CLEAR';
export function clear() {
	return {
		type: CLEAR
	};
}

export const CLEAR_ALL = 'CLEAR_ALL';
export function clearAll() {
	return {
		type: CLEAR_ALL
	};
}


export const CONNECTION_REJECT = 'CONNECTION_REJECT';
export function connectionReject(params) {
	return {
		CALL_API: {
			type: CONNECTION_REJECT,
			method: 'get',
			target: '/connection/reject',
			params,
		}
	};
}

export const CONNECTION_ACCEPT = 'CONNECTION_ACCEPT';
export function connectionAccept(params) {
	return {
		CALL_API: {
			type: CONNECTION_ACCEPT,
			method: 'get',
			target: '/connection/accept',
			params,
		}
	};
}
