import {requestData, receiveData, receiveCount, receiveFail} from './queryTool';
import { createElogByAction } from '../../../util/elog';
import { showPlatformAlert } from '../alert';

/**
 * 酷 不酷
 */
export const LIKE_THIS_ACTIVITY = 'LIKE_THIS_ACTIVITY';
export const likeUnlike = (activity) => (dispatch, getState) => {
	const likeIt = activity.likeIt;

	// 頻道文章不受黑名單限制 http://jira.104.com.tw/browse/BIGC-1526
	const isChannelActivity = activity.channelInfo && activity.channelInfo.type === 10;
	if (activity.userInfo.blockStatus && !isChannelActivity) {
		return dispatch(showPlatformAlert('權限不足，無法操作這個動作'));
	}

	dispatch(receiveData(LIKE_THIS_ACTIVITY, {
		aid: activity.aid, 
		isLike: likeIt === true ? false : true
	}, {user: getState().user}));
	
	return dispatch({
		'CALL_API': {
			type: LIKE_THIS_ACTIVITY,
			method: 'post',
			target: '/activity/' + (likeIt === true ? 'unlike' : 'like'),
			params: {
				aid: activity.aid,
				aidParent: activity.aidParent || activity.aid
			}
		}
	}).then((response) => {
		if(!response.response){	
			return dispatch(receiveFail(LIKE_THIS_ACTIVITY, response));
		}else {
			if(!likeIt) createElogByAction(LIKE_THIS_ACTIVITY, activity, getState());
		}
	});
}

/**
 * 收藏 不收藏
 */
export const COLLECT_THIS_ACTIVITY = 'COLLECT_THIS_ACTIVITY';
export const collectNotcollect = (activity) => (dispatch, getState) => {
	const collectIt = activity.collectIt;

	// 頻道文章不受黑名單限制 http://jira.104.com.tw/browse/BIGC-1526
	const isChannelActivity = activity.channelInfo && activity.channelInfo.type === 10;
	if (activity.userInfo.blockStatus && !isChannelActivity) {
		return dispatch(showPlatformAlert('權限不足，無法操作這個動作'));
	}
	
	dispatch(receiveData(COLLECT_THIS_ACTIVITY, {
		aid: activity.aid, 
		//aidParent: activity.aidParent,
		isCollect: collectIt === true ? false : true
	}, {user: getState().user}));	
		
	return dispatch({
		'CALL_API': {
			type: COLLECT_THIS_ACTIVITY,
			method: 'post',
			target: '/activity/' + (collectIt === true ? 'removecollect' : 'collect'),
			params: {
				aid: activity.aid
			}
		}
	}).then((response) => {
		if(!response.response){
			return dispatch(receiveFail(COLLECT_THIS_ACTIVITY, response));
		}
	});
}

/**
 * ˊ追蹤 不追蹤
 */
export const SUBSCRIBE_SOMEBODY = 'SUBSCRIBE_SOMEBODY';
export const subscribeUnsubscribe = (activity) => (dispatch, getState) => {
	const subscribeStatus = activity.userInfo.subscribeStatus;

	if (activity.userInfo.blockStatus) {
		return dispatch(showPlatformAlert('權限不足，無法操作這個動作'));
	}
	
	dispatch(receiveData(SUBSCRIBE_SOMEBODY, {
		aid: activity.aid, 
		//aidParent: activity.aidParent,
		isSubscribeStatus: subscribeStatus === true ? false : true
	}));	
		
	return dispatch({
		'CALL_API': {
			type: SUBSCRIBE_SOMEBODY,
			method: 'post',
			target: '/activity/' + (subscribeStatus === true ? 'unsubscribe' : 'subscribe'),
			params: {
				targetPid: activity.userInfo.pid
			}
		}
	}).then((response) => {
		if(!response.response){
			return dispatch(receiveFail(SUBSCRIBE_SOMEBODY, response));
		}
	});
}

/*
 * 對文章沒興趣
 */
export const IGNORE_ACTIVITY = 'IGNORE_ACTIVITY';
export const ignoreActivity = (activity) => (dispatch, getState) => {
	dispatch(receiveData(IGNORE_ACTIVITY, {
		aid: activity.aid, 
		//aidParent: activity.aidParent,
		ignore: activity.ignore ? false : true
	}));
	
	// 10秒後沒有取消就會去打 api
	setTimeout(() => {
		if (getState().activity.activityPool[activity.aid].ignore === 'article') {
			return dispatch({
				CALL_API: {
					type: IGNORE_ACTIVITY,
					method: 'post',
					target: '/activity/ignore',
					params: {
						aid: activity.aid
					}
				}
			}).then((response) => {
				if (!response.response) {
					return dispatch(receiveFail(IGNORE_ACTIVITY, response));
				}
			});
		}
	}, 10000);
}

/**
 * 取消對文章沒興趣
 */
//export const UNDO_IGNORE_ACTIVITY = 'UNDO_IGNORE_ACTIVITY';
export const undoIgnore = (activity) => (dispatch, getState) => {
	dispatch(receiveData(IGNORE_ACTIVITY, {
		aid: activity.aid,
		//aidParent: activity.aidParent,
		ignore: activity.ignore ? false : true
	}));
}

/*
 * 對作者沒興趣
 */
export const NOT_INTERESTED_SOMEBODY = 'NOT_INTERESTED_SOMEBODY';
export const notInterested = (activity) => (dispatch, getState) => {
	dispatch(receiveData(NOT_INTERESTED_SOMEBODY, {
		aid: activity.aid, 
		//aidParent: activity.aidParent,
		ignore: activity.ignore ? false : true
	}));
	
	// 10秒後沒有取消就會去打 api
	setTimeout(() => {
		if (getState().activity.activityPool[activity.aid].ignore === 'person') {
			return dispatch({
				CALL_API: {
					type: NOT_INTERESTED_SOMEBODY,
					method: 'post',
					target: '/activity/notInterested',
					params: {
						targetPid: activity.pid
					}
				}
			}).then((response) => {
				if (!response.response) {
					return dispatch(receiveFail(NOT_INTERESTED_SOMEBODY, response));
				}
			});
		}
	}, 10000);
}

/**
 * 取消對作者沒興趣
 */
//export const UNDO_NOT_INTERESTED_SOMEBODY = 'UNDO_NOT_INTERESTED_SOMEBODY';
export const undoNotInterested = (activity) => (dispatch, getState) => {
	dispatch(receiveData(NOT_INTERESTED_SOMEBODY, {
		aid: activity.aid,
		//aidParent: activity.aidParent,
		ignore: activity.ignore ? false : true
	}));
}

/**
 *  瀏覽數
 */
export const VIEW_ACYIVITY = 'VIEW_ACYIVITY';
export const viewActivity = (activity) => (dispatch, getState) => {
	dispatch(receiveData(VIEW_ACYIVITY, {
		aid: activity.aid
	}));
	
	return dispatch({
		CALL_API: {
			type: VIEW_ACYIVITY,
			method: 'post',
			target: '/activity/viewActivity',
			params: {
				aid: activity.aid
			}
		}
	}).then((response) => {
		if (!response.response) {
			return dispatch(receiveFail(VIEW_ACYIVITY, response));
		}
	});
}