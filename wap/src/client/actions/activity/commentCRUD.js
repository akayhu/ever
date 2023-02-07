import {getMockId, nowTimeObj} from './activityCRUD';
import {requestData, receiveData, receiveCount, receiveFail} from './queryTool';

/**
 * 對pool與河道建立留言資料
 */
export const BROADCAST_CREATE_COMMENT = 'BROADCAST_CREATE_COMMENT';
export const broadcastCreateComment = (activity) => {
	return receiveData(BROADCAST_CREATE_COMMENT, activity);
}

/**
 * 對pool與河道移除留言資料
 */
export const BROADCAST_DELETE_COMMENT = 'BROADCAST_DELETE_COMMENT';
export const broadcastDeleteComment = (activity) => {
	return receiveData(BROADCAST_DELETE_COMMENT, activity);
}

/**
 * 對pool與河道交換留言資料
 */
export const BROADCAST_SWITCH_COMMENT = 'BROADCAST_SWITCH_COMMENT';
export const broadcastSwitchComment = (oldComment, newComment) => {
	return receiveData(BROADCAST_SWITCH_COMMENT, {}, {oldActivity:oldComment, newActivity:newComment});
}

/**
 * 對pool與河道修改留言資料
 */
export const BROADCAST_UPDATE_COMMENT = 'BROADCAST_UPDATE_COMMENT';
export const broadcastUpdateComment = (activity) => {
	return receiveData(BROADCAST_UPDATE_COMMENT, activity);
}

/**
 * 新增留言
 */
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const createComment = (params) => (dispatch, getState) => {
	const mockId = getMockId();
	const fakeComment = {
		...params,
		aid: mockId,
		avoidSearched: false,
		channelInfo: null,
		collectCount: 0,
		collectIt: false,
		collectList: [],
		commentCount: 0,
		commentList: [],
		contentType: 1,
		createDate: new Date().getTime(),
		createDateStr: nowTimeObj(),
		endorseCount: 0,
		endorseHoneyPot: [],
		endorseIt: false,
		endorseItemCount: 0,
		endorseItemList: [],
		endorsePreferences: [],
		extra: JSON.parse(params.extra) || params.extra,
		extraInfo: JSON.parse(params.extra) || params.extra,
		likeCount: 0,
		likeIt: false,
		likeList: [],
		personalMeta: null,
		representativeFile: null,
		userInfo: getState().user,
		verb: 2,
		viewCount: 0
	};

	dispatch(broadcastCreateComment(fakeComment));
	return dispatch({
		'CALL_API': {
			type: CREATE_COMMENT,
			method: 'post',
			target: '/activity/createComment',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(broadcastSwitchComment(fakeComment, response.response));
		}else{
			return dispatch(receiveFail(CREATE_COMMENT, response));
		}
	});
}

/**
 * 修改留言
 */
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const updateComment = (params) => (dispatch, getState) => {
	const oldComment = getState().activity.activityPool[params.aid];
	const newComment = JSON.parse(params.activity);
	const fakeComment = {
		...oldComment,
		...newComment
	};
	
	dispatch(broadcastUpdateComment(fakeComment));
	return dispatch({
		'CALL_API': {
			type: UPDATE_COMMENT,
			method: 'post',
			target: '/activity/update',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(broadcastUpdateComment(response.response));
		}else{
			return dispatch(receiveFail(UPDATE_COMMENT, response));
		}
	});
}

/**
 * 刪除留言
 */
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const deleteComment = (activity) => (dispatch, getState) => {
	return dispatch({
		'CALL_API': {
			type: DELETE_COMMENT,
			method: 'post',
			target: '/activity/delete',
			params: {
				aidParent: activity.aidParent,
				aid: activity.aid
			}
		}
	}).then((response) => {
		if(response.response && response.response === true){
			return dispatch(broadcastDeleteComment(activity));
		}else{
			return dispatch(receiveFail(DELETE_COMMENT, response));
		}
	});
}

/**
 * 刪除被檢舉留言
 */
export const deleteAccuseComment = ( activity ) => (dispatch, getState) => {
	activity.content = '此留言無法顯示，系統管理員正在處理中';
	activity.extra.accuseStatus = 1;
	return dispatch(broadcastUpdateComment(activity));
}