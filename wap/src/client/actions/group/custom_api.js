import Promise from 'bluebird';
import * as GroupApi from './group_api';
import {getPersonalWall, initPersonalWall} from '../activity/index';
import {actionMap, parameterMap, isWrong, canNotLoad, idToCategory, shouldReset} from './utils';

// selectors
import { getSearchKeyWord, getCurrentCount, getVerifyStatus, getChannelId } from '../../reducers/group';
// constants
export const CHANGE_CATEGORY_TITLE = 'CHANGE_CATEGORY_TITLE';
export const REQUEST_DATA = '[GROUP]_REQUEST_DATA';
export const RECEIVE_DATA = '[GROUP]_RECEIVE_DATA';
export const RECEIVE_FAIL = '[GROUP]_RECEIVE_FAIL';
export const REACH_END = '[GROUP]_REACH_END';

export const CHANGE_GROUP_TAB = 'CHANGE_GROUP_TAB';            // for 個別社團內部橘色頁籤（包含 subNav 和 左側）
export const CHANGE_GROUP_LIST_TAB = 'CHANGE_GROUP_LIST_TAB';  // fot 社團列表橘色頁籤
export const CLEAR_DATA = 'CLEAR_DATA';

export const CHECK_APPLICANT = 'CHECK_APPLICANT';
export const CHECK_ALL_APPLICANTS = 'CHECK_ALL_APPLICANTS';

export const VERIFYING_MEMBERS = 'VERIFY_MEMBER';
export const VERIFY_MEMBER_SUCCESS = 'VERIFY_MEMBER_SUCCESS';
export const VERIFY_MEMBER_ERROR = 'VERIFY_MEMBER_ERROR';
// for veryfy activity
export const TRIGGER_SORT = 'TRIGGER_SORT';
export const CHECK_ACTIVITY = 'CHECK_ACTIVITY';
// export const CHECK_ALL_ACTIVITIES = 'CHECK_ALL_ACTIVITIES';
export const ALERT_CHECK_LIMIT = 'ALERT_CHECK_LIMIT';
export const CLOSE_ACTIVITY_ALERT = 'CLOSE_ACTIVITY_ALERT';
export const DELETING_ACTIVITIES = 'DELETING_ACTIVITIES';
export const DELETE_ACTIVITY_SUCCESS = 'DELETE_ACTIVITY_SUCCESS';
export const DELETE_ACTIVITY_ERROR = 'DELETE_ACTIVITY_ERROR';
export const DELETING_SINGLE_ACTIVITIES = 'DELETING_SINGLE_ACTIVITIES';
export const DELETING_BATCH_ACTIVITIES = 'DELETING_BATCH_ACTIVITIES';

export const TRIGGER_SEARCH = 'TRIGGER_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

export const CHANGE_MEMBER_RULE = 'CHANGE_MEMBER_RULE';
export const ON_DELETE_GROUP_MEMBER = 'ON_DELETE_GROUP_MEMBER';

export const SET_SHOULD_RESET = 'SET_SHOULD_RESET';
export const CLEAR_SHOULD_RESET = 'CLEAR_SHOULD_RESET';

export const LEAVE_GROUP_SUCCESS = 'LEAVE_GROUP_SUCCESS';

export const UPDATE_GROUP_INFO = 'UPDATE_GROUP_INFO';
// action creators
export function loadDataByCategory(category, options = {}) {
	return (dispatch, getState) => {
		const state = getState().group;
		if (shouldReset(state, category)) {
			dispatch(clearData(category));
			dispatch(clearShouldReset(category));
		} else if (canNotLoad(state, category)) {
			// 載入中或是已經end了則不重覆發action
			return Promise.resolve(); // for return thenable;
		} else if (category === 'groupAdmins') {
			const groupInfo = getState().group.entities[options.channelId];
			if (groupInfo && !groupInfo.isMember && groupInfo.type === 7) {
				return Promise.resolve([]);
			}
		}

		dispatch(requestData(category));// 改變load = true

		const parameters = parameterMap(category, getState, options);// 根據category去組不同的參數

		return dispatch(actionMap(category)(parameters)).then((res) => { // 根據category去拉不同的Api
			const response = res.response;
			if (isWrong(response)) {
				dispatch(receiveFail(category, response));
			} else {
				dispatch(receivetData(category, response));// 把res dispatch出去
				if (category === 'groupActivity' || category === 'groupActivityForCheck') {
					if (response.nextFrom === undefined) dispatch(reachEnd(category));
				} else if (!response.hasNext) {
					dispatch(reachEnd(category));
				}
			}
			return response;// thenable.
		});
	};
}

// For page initialize
export function initGroupIndex(props) {
	if (props) {
		const { category = 'recommend', ...options } = props;
		return (dispatch, getState) => {
			const { isLogin } = getState().user;
			let loadPage = category;
			if (!isLogin) loadPage = 'knowAndTech';

			dispatch(changeTab(loadPage, options));
			dispatch(loadDataByCategory('categoryTitles'));
			dispatch(loadDataByCategory('myGroupTitle'));
		};
	}
}

export function initApplyGroup() {
	return dispatch => dispatch(GroupApi.getEmailInfoByPid());
}

export function initGroupPage(params) {
	return (dispatch) => {
		dispatch(clearData('groupInfo'));
		dispatch(changeGroupTab('activity'));
		dispatch(clearData('groupMembers'));
		// dispatch(clearData('groupActivity'));
		return dispatch(loadDataByCategory('groupInfo', params))
			.then((res) => {
				dispatch(loadDataByCategory('groupAdmins', params));
				return res;
			});
	};
}

export function initMembersJoinPage(params) {
	return (dispatch) => {
		dispatch(clearData('applyList'));
		dispatch(loadDataByCategory('applyList', params));
	};
}
export function initManageActivity(params) {
	return (dispatch) => {
		dispatch(clearData('groupActivityForCheck'));
		dispatch(loadDataByCategory('groupActivityForCheck', params));
	};
}

export function initMembersPage(params) {
	return dispatch => dispatch(loadDataByCategory('groupMembers', params));
}

// export function updateGroupCover(params) {
// 	return dispatch => {
// 		uploadToS3()
// 	}
// }

export function changePageByCategory(category) {
	return (dispatch, getState) => {
		dispatch(changeCategory(category));

		const nowState = getState().group;
		if (getCurrentCount(nowState, category) === 0) {
			return dispatch(loadDataByCategory(category));
		}
		return Promise.resolve();
	};
}

export function changeCategory(category) {
	return {
		type: CHANGE_CATEGORY_TITLE,
		category
	};
}
// 社團列表的分類tab
export function changeTab(tab, options) {
	return (dispatch, getState) => {
		const nowState = getState().group;
		dispatch({ type: CHANGE_GROUP_LIST_TAB, tab });

		if (shouldReset(nowState, tab)) {
			dispatch(clearData(tab));
			dispatch(clearShouldReset(tab));
			return dispatch(loadDataByCategory(tab, options));
		} else if (!getCurrentCount(nowState, tab)) {
			return dispatch(loadDataByCategory(tab, options));
		}
		return Promise.resolve();
	};
}
// subNav的tab
export function changeGroupTab(tab, shouldClearSearch = true) {
	return (dispatch) => {
		dispatch({
			type: CHANGE_GROUP_TAB,
			tab
		});
		if (shouldClearSearch) {
			dispatch(clearSearch());
		}
	};
}

export function triggerLeaveGroup(channelId, category, categoryId) {
	return dispatch =>
		dispatch(GroupApi.leaveGroup({ channelId })).then((res) => {
			if (res.response) {
				dispatch(setShouldReset(category));
				dispatch(setShouldReset(idToCategory(categoryId)));
				dispatch(loadDataByCategory('myGroupTitle'));
				return true;
			}
			return false;
		});
}

export function triggerCancelApplyJoin(channelId, category, categoryId) {
	return dispatch =>
		dispatch(GroupApi.cancelApplyJoin({ channelId })).then((res) => {
			if (res.response) {
				dispatch(setShouldReset(category));
				if (categoryId) {
					dispatch(setShouldReset(idToCategory(categoryId)));
				}
				dispatch(loadDataByCategory('myGroupTitle'));
				return true;
			}
			return false;
		});
}

export function triggerApplyJoinGroup(channelId, joinSetting) {
	return dispatch =>
		dispatch(GroupApi.applyJoinGroup({ channelId })).then((res) => {
			if (res.response) {
				const resetCategory = joinSetting ? 'waitForJoin' : 'joined';
				dispatch(setShouldReset(resetCategory));
				dispatch(loadDataByCategory('myGroupTitle'));
				return true;
			}
			return false;
		});
}

export function initTriggerSort() {
	return {
		type: TRIGGER_SORT,
		category: 'groupActivityForCheck',
		sortInfo: {
			sortField: undefined,
			sortOrder: -1
		}
	};
}

// verify-activity
export const triggerSort = newField => (dispatch, getState) => {
	const nowState = getState().group;
	const { sortField, sortOrder } = getVerifyStatus(nowState);

	let sortInfo;
	if (sortField === newField) {
		sortInfo = { sortField, sortOrder: -sortOrder };
	} else {
		sortInfo = { sortField: newField, sortOrder: -1 };
	}

	// dispatch(clearData('groupActivityForCheck'));
	dispatch({
		type: TRIGGER_SORT,
		category: 'groupActivityForCheck',
		...sortInfo
	});
	// dispatch(loadDataByCategory('groupActivityForCheck', {
	// 	channelId: getChannelId(nowState)})
	// );

	dispatch(initPersonalWall('GROUP', {
		channelId: getChannelId(nowState)
	}));

	return getPersonalWall('GROUP', {
		channelId: getChannelId(nowState),
		sortField: sortInfo.sortField,
		order: sortInfo.sortOrder
	})(dispatch, getState);
};

export const checkActivity = aid => (dispatch, getState) => {
	// 最多只能選10筆
	const aidIsExist = getVerifyStatus(getState().group).checkedStack.indexOf(aid) !== -1;
	const canCheck = getVerifyStatus(getState().group).checkedNumber < 10;
	if (aidIsExist || canCheck) {
		dispatch({
			type: CHECK_ACTIVITY,
			category: 'groupActivityForCheck',
			aid
		});
	} else {
		dispatch({
			type: ALERT_CHECK_LIMIT,
			category: 'groupActivityForCheck',
		});
	}
};

export const closeActivityAlert = () => ({
	type: CLOSE_ACTIVITY_ALERT,
	category: 'groupActivityForCheck'
});

// 取消全選
// export const checkAllActivities = () => ({
// 	type: CHECK_ALL_ACTIVITIES,
// 	category: 'groupActivityForCheck',
// })
export const deleteActivity = ({channelId, aidList}) => (dispatch) => {
	dispatch(deletingSingleActivity()); // 用來改變verifyStatus中的msg
	return dispatch(triggerDeleteActivityApi(channelId, aidList));
};

export const deleteBatchActivity = channelId => (dispatch, getState) => {
	const aidList = getVerifyStatus(getState().group).checkedStack;
	if (!aidList.length) return Promise.resolve();

	dispatch(deletingBatchActivities()); // 用來改變verifyStatus中的msg和batchloading
	return dispatch(triggerDeleteActivityApi(channelId, aidList));
};

const triggerDeleteActivityApi = (channelId, aidList) => (dispatch) => {
	dispatch(deletingActivities(aidList));

	return dispatch(GroupApi.batchRemoveChannelActivity({ channelId, aidList })).then((res) => {
		if (res.response) {
			dispatch(deleteActivitySuccess(channelId, aidList));
		} else {
			dispatch(deleteActivityError(channelId, aidList));
		}
	});
};

const deletingActivities = aidList => ({
	type: DELETING_ACTIVITIES,
	category: 'groupActivityForCheck',
	aidList
});

const deletingSingleActivity = () => ({
	type: DELETING_SINGLE_ACTIVITIES,
	category: 'groupActivityForCheck'
});

const deletingBatchActivities = () => ({
	type: DELETING_BATCH_ACTIVITIES,
	category: 'groupActivityForCheck'
});

const deleteActivitySuccess = (channelId, aidList) => (dispatch, getState) => {
	const nowState = getState().group;
	const { sortField, sortOrder } = getVerifyStatus(nowState);

	dispatch({
		type: DELETE_ACTIVITY_SUCCESS,
		category: 'groupActivityForCheck',
		channelId,
		aidList
	});

	const dataList = getState().activity.personalStream.GROUP[channelId].dataList;

	// 刪除後小於5比自動重載入資料
	if (dataList.length <= 5) {
		getPersonalWall('GROUP', {
			channelId,
			sortField,
			order: sortOrder
		})(dispatch, getState);
	}
};

const deleteActivityError = (channelId, aidList) => ({
	type: DELETE_ACTIVITY_ERROR,
	category: 'groupActivityForCheck',
	channelId,
	aidList
});

// verify-member
export const verifySingleMember = (pid, channelId, isPass) => dispatch =>
	dispatch(triggerVerifyApi(pid, channelId, isPass));


export const verifyBatchMember = (channelId, isPass) => (dispatch, getState) => {
	const pids = getState().group.groupInfo.applyList.dataList
		.filter(item => item.checked)
		.map(item => item.pid);

	if (!pids.length) return Promise.resolve();

	return dispatch(triggerVerifyApi(pids, channelId, isPass));
};

const triggerVerifyApi = (pids, channelId, isPass) => (dispatch) => {
	dispatch(verifyingMembers(pids));
	return dispatch(GroupApi.verifyGroupMember({ targetPids: pids, channelId, isPass }))
		.then((res) => {
			if (res.response) {
				dispatch(verifyMemberSuccess(pids, isPass));
				dispatch(setShouldReset('groupMembers'));
			} else {
				dispatch(verifyMemberError(pids));
			}
			return res.response; // BOOL
		});
};

const verifyingMembers = pids => ({
	type: VERIFYING_MEMBERS,
	category: 'applyList',
	pids
});

const verifyMemberSuccess = pids => ({
	type: VERIFY_MEMBER_SUCCESS,
	category: 'applyList',
	pids
});

const verifyMemberError = pids => ({
	type: VERIFY_MEMBER_ERROR,
	category: 'applyList',
	pids
});

export const checkApplicant = pid => ({
	type: CHECK_APPLICANT,
	category: 'applyList',
	pid
});

export const checkAllApplicants = () => ({
	type: CHECK_ALL_APPLICANTS,
	category: 'applyList',
});


export const clearData = category => ({
	type: CLEAR_DATA,
	category
});


const requestData = category => ({
	type: REQUEST_DATA,
	category
});

const receivetData = (category, response) => ({
	type: RECEIVE_DATA,
	category,
	response
});

const receiveFail = (category, message) => ({
	type: RECEIVE_FAIL,
	category,
	message
});

const reachEnd = category => ({
	type: REACH_END,
	category
});

export const triggerSearch = ({keyword, channelId, category}) => (dispatch, getState) => {
	const label = (category === 'searchMembers') ? 'memberKeyWord' : 'activityKeyWord';
	const lastSearchWord = getSearchKeyWord(getState().group)[label];
	if (keyword === lastSearchWord) return;
	dispatch({
		type: TRIGGER_SEARCH,
		category,
		keyword
	});

	if (category === 'searchMembers') {
		dispatch(clearData('searchMembers'));
		dispatch(loadDataByCategory('searchMembers', { channelId, name: keyword }));
	} else {
		dispatch(changeGroupTab('activity', false));
	}
};

export function clearSearch() {
	return {
		type: CLEAR_SEARCH
	};
}

export const changeMemberRule = ({ targetPid, channelId, isAdmin }) => dispatch =>
	dispatch(GroupApi.setGroupAdmin({ targetPid, channelId, isAdmin })).then((res) => {
		const success = res.response;
		if (success) {
			dispatch({
				type: CHANGE_MEMBER_RULE,
				category: 'groupMembers',
				targetPid,
				isAdmin
			});
			return true;
		}
		alert(res.response);
		return false;
	});

export const onDeleteGroupMember = ({ targetPid, channelId }) => dispatch =>
	dispatch(GroupApi.deleteGroupMember({ targetPid, channelId })).then((res) => {
		const success = res.response;
		if (success) {
			dispatch({
				type: ON_DELETE_GROUP_MEMBER,
				category: 'groupMembers',
				targetPid
			});
			return true;
		}
		alert(res.response);
		return false;
	});


export const setShouldReset = category => ({
	type: SET_SHOULD_RESET,
	category
});

export const clearShouldReset = category => ({
	type: CLEAR_SHOULD_RESET,
	category
});

export const triggerUpdateGroup = params => dispatch =>
	dispatch(GroupApi.updateGroup(params)).then((res) => {
		dispatch({
			type: UPDATE_GROUP_INFO,
			category: 'groupInfo',
			response: res.response
		});
		return 'done';
	});

// export const changeGroupHead = ({ targetPid, channelId }) => dispatch => {
// 	return dispatch(GroupApi.setGroupHead({ targetPid, channelId })).then(res => {
// 		const success = res.response;
// 		if (success) {
// 			dispatch({
// 				type: CHANGE_GROUP_HEAD,
// 				category: 'groupInfo',
//
// 			})
// 		}
// 	})
// }
