import { has } from 'lodash/object';
import { keyBy } from 'lodash/collection';
import {
	like,
	unlike,
	collect,
	removeCollect,
	getActivity,
	getCommentList,
	getRelatedActivity,
	createComment,
	deleteEndorse,
	addEndorse,
} from './activity_api';
import {receiveFail, addToEntities} from 'src/client/actions/general';
import { changeSSRStatus } from 'src/client/actions/ssrStatusCode';
import clientConfig from 'src/configs/client';
import {isWrong} from 'src/util/checkTools';

const { actions: { metadata: { setMetadata, strip_tags } } } = require('c_platform');

export const STORE_ADD_ENDORSE = 'STORE_ADD_ENDORSE';
export const TRIGGER_LIKE = 'TRIGGER_LIKE';
export const TRIGGER_COLLECT = 'TRIGGER_COLLECT';
export const ADD_RELATED_LIST_TO_PARENT_AID = 'ADD_RELATED_LIST_TO_PARENT_AID';
export const ADD_COMMENT_LIST_TO_PARENT_AID = 'ADD_COMMENT_LIST_TO_PARENT_AID';
export const STORE_CREATE_COMMENT = 'STORE_CREATE_COMMENT';
export const OPEN_ACTIVITY_LAYER = 'OPEN_ACTIVITY_LAYER';
export const COLSE_ACTIVITY_LAYER = 'COLSE_ACTIVITY_LAYER';
export const ACTIVE_ACTIVITY = 'ACTIVE_ACTIVITY';

export const triggerLike = (checked, params) => (dispatch, getState) => {
	if (validBlock(getState, params.aid)) return;
	const { pid, userName, avatarWebUrl, companyName, jobTitle, schoolName, major } = getState().user;
	const { aid } = params;
	const data = {
		pid,
		userInfo: {
			pid,
			userName,
			userFileUrl: avatarWebUrl,
			userCompany: companyName,
			userJobTitle: jobTitle,
			schoolName,
			major,
		},
	};
	dispatch({
		type: TRIGGER_LIKE,
		payload: { data, aid, checked },
	});

	if (checked) {
		return dispatch(like(params));
	}
	return dispatch(unlike(params));
};

export const triggerCollect = (checked, params) => (dispatch, getState) => {
	if (validBlock(getState, params.aid)) return;
	const { pid, userName, avatarWebUrl, companyName, jobTitle, schoolName, major } = getState().user;
	const { aid } = params;
	const data = {
		pid,
		userInfo: {
			pid,
			userName,
			userFileUrl: avatarWebUrl,
			userCompany: companyName,
			userJobTitle: jobTitle,
			schoolName,
			major,
		},
	};
	dispatch({
		type: TRIGGER_COLLECT,
		payload: {data, aid, checked},
	});

	if (checked) {
		return dispatch(collect(params));
	}
	return dispatch(removeCollect(params));
};

// 取得獨立頁的時候用
export const initSinglePage = (aid, aidParent = aid) => dispatch => dispatch(getActivity({ aid, aidParent })).then(({ response }) => {
	if (!response) {
		dispatch(changeSSRStatus(404));
	}
	const domain = 'singlePage';
	const key = 'fetchActivity';
	const toEntity = 'activities';
	const option = { aid };

	if (isWrong(response)) {
		return dispatch(receiveFail({ domain, key, option }));
	}

	if (response) {
		dispatch(setMetadata('activity', {
			aid: response.aid,
			author: (response.userInfo ? response.userInfo.userName : ''),
			title: `${response.title} - 104 職涯社群`,
			description: strip_tags(response.content),
			image: (response.extraInfo && response.extraInfo.attachmentList && response.extraInfo.attachmentList[0] ? response.extraInfo.attachmentList[0].activityFileUrl : ''),
			url: `https:${clientConfig.params.wapUrl}/activity/${response.aid}`,
		}));
	} else {
		dispatch(setMetadata('activity'));
	}

	if (response) {
		const byIds = { [response.aid]: response };
		return dispatch(addToEntities({ domain, key, toEntity, byIds }));
	}
});

export const fetchCommentList = (aid, limit = 10) => (dispatch, getState) => {
	const ts = getState().entities.activities[aid].ts || 0;
	return dispatch(getCommentList({
		aidParent: aid,
		ts,
		limit,
	})).then(({ response }) => {
		const domain = 'singlePage';
		const key = 'fetchCommentList';
		const toEntity = 'activities';

		if (isWrong(response)) {
			return dispatch(receiveFail({ domain, key }));
		}

		const byIds = keyBy(response.activityList, 'aid');
		dispatch(addToEntities({ domain, key, toEntity, byIds }));
		dispatch(addCommentListToParentAid(aid, Object.keys(byIds), response.ts));
	});
};

export const fetchRelatedList = aid => dispatch => dispatch(getRelatedActivity({
	aid,
})).then(({ response }) => {
	const domain = 'singlePage';
	const key = 'fetchRelatedList';
	const toEntity = 'activities';

	const byIds = keyBy(response, 'aid');
	dispatch(addToEntities({ domain, key, toEntity, byIds }));
	dispatch(addRelatedListToParentAid(aid, Object.keys(byIds)));
});

export const prepareCreateComment = params => (dispatch, getState) => {
	if (validBlock(getState)) return Promise.reject('block');
	return dispatch(createComment({
		...params,
	})).then(({ response }) => {
		const domain = 'singlePage';
		const key = 'createComment';
		const toEntity = 'activities';
			// if (isWrong(response)) {
			// 	console.error("--- createComment error ---")
			// 	return;
			// }
		const byIds = { [response.aid]: response };
		dispatch(addToEntities({ domain, key, toEntity, byIds }));
		dispatch(storeCreateComment(response));
	});
};

export const prepareEndorseIt = (flag, params) => (dispatch, getState) => {
	if (validBlock(getState)) return;
	switch (flag) {
		case '給肯定': {
			dispatch(storeAddEndorse(true, params.aid, params.item));
			dispatch(addEndorse(params)).then(({ response }) => {
				if (!response) {
					console.error('肯定發生錯誤');
				}
			});
			break;
		}
		case '收肯定': {
			dispatch(storeAddEndorse(false, params.aid, params.item));
			dispatch(deleteEndorse(params)).then(({ response }) => {
				if (!response) {
					console.error('肯定發生錯誤');
				}
			});
			break;
		}
		default:
			break;
	}
};

/**
 *  將store的肯定數字更改
 */
export function storeAddEndorse(flag, aid, item) {
	return {
		type: STORE_ADD_ENDORSE,
		flag,
		aid,
		item,
	};
}

/**
 *  將新建立的留言推進store
 */
export function storeCreateComment(response) {
	return {
		type: STORE_CREATE_COMMENT,
		response,
	};
}

/**
 *  將relatedList推進activity
 */
export function addRelatedListToParentAid(aid, dataList) {
	return {
		type: ADD_RELATED_LIST_TO_PARENT_AID,
		aid,
		dataList,
	};
}

/**
 *  將commentList推進activity
 */
export function addCommentListToParentAid(aid, dataList, ts) {
	return {
		type: ADD_COMMENT_LIST_TO_PARENT_AID,
		aid,
		dataList,
		ts,
	};
}

/**
 * 當前點擊 酷、收藏的文章aid
 * 或
 * 當前layer顯示的文章aid
 */
export function activeActivity(aid) {
	return {
		type: ACTIVE_ACTIVITY,
		aid,
	};
}

/**
 * 開啟Layer
 */
export function layerActivityOpen(activity) {
	return {
		type: OPEN_ACTIVITY_LAYER,
		aid: activity.aid,
		from: activity.from,
	};
}

/**
 * 關閉Layer
 */
export function layerActivityClose() {
	return {
		type: COLSE_ACTIVITY_LAYER,
	};
}

// 判斷是否為黑名單
function validBlock(getState, aid) {
	const activeAid = aid || getState().activeActivity;
	return getState().entities.activities[activeAid].userInfo.blockStatus;
}

// function strip_tags (input, allowed) {
//   allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
//   var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
//   var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
//   return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
//     return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
//   }).replace(/\s\s/g,'')
// }
