import {requestData, receiveListData, receiveCount, receiveFail} from './queryTool';

// 文章留言
export const GET_COMMENT_LIST = 'GET_COMMENT_LIST';
export const getCommentList = (aid, limit) => (dispatch, getState) => {
	const streamTarget = getState().activity.activityPool[aid];
	const ts = streamTarget.getCommentListTs || 0;
	
	limit = limit || 10;
	
	if(!streamTarget.commentLoading && !streamTarget.commentEnd){
		dispatch(requestData('COMMENT', {aid}));
		return dispatch({
			'CALL_API': {
				type: GET_COMMENT_LIST,
				method: 'get',
				target: '/activity/getCommentList',
				params: {
					aidParent: aid,
					ts,
					limit
				}
			}
		}).then((response) => {
			if(response.response){
				return dispatch(receiveListData(GET_COMMENT_LIST, response.response, {aid}));
			}else{
				return dispatch(receiveFail(GET_COMMENT_LIST, response));
			}
		});
	}else{
		return Promise.resolve();
	}
}
