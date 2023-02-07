import { initPersonalWall } from './activityList';
import { actions as CPlatformActions } from 'c_platform';
import { receiveData, receiveFail} from './queryTool';
import stripTags from 'src/util/stripTags';
import moment from 'moment-timezone';
import { changeSSRStatus } from 'src/client/actions/ssrStatusCode';

const { setMetadata } = CPlatformActions.metadata;

export function nowTimeObj() {
	const date = new Date();
	const	year = date.getFullYear(); // 年
	const	month = date.getMonth() + 1; // 月
	const	day = date.getDate(); // 日
	const	hours = date.getHours(); // 時
	const	minutes = date.getMinutes(); // 分
	const	seconds = date.getSeconds(); // 秒

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 年-月-日 時:分:秒;
}

export function getMockId() {
	return `activity_mock_${(Math.round(Math.random() * 2147483647))}`;
}

// 文章初始化
export const INIT_ACTIVITY = 'INIT_ACTIVITY';
export const initActivity = (params) => {
	return {
		type: INIT_ACTIVITY,
		params
	};
};

/**
 * 對pool與河道建立文章資料
 */
export const BROADCAST_CREATE_ACTIVITY = 'BROADCAST_CREATE_ACTIVITY';
export const broadcastCreateActivity = (activity) => {
	return receiveData(BROADCAST_CREATE_ACTIVITY, activity);
};

/**
 * 對pool與河道移除文章資料
 */
export const BROADCAST_DELETE_ACTIVITY = 'BROADCAST_DELETE_ACTIVITY';
export const broadcastDeleteActivity = (activity) => {
	return receiveData(BROADCAST_DELETE_ACTIVITY, activity);
};

/**
 * 對pool與河道交換文章資料
 */
export const BROADCAST_SWITCH_ACTIVITY = 'BROADCAST_SWITCH_ACTIVITY';
export const broadcastSwitchActivity = (oldActivity, newActivity) => {
	return receiveData(BROADCAST_SWITCH_ACTIVITY, {}, {oldActivity, newActivity});
};

/**
 * 對pool與河道修改文章資料
 */
export const BROADCAST_UPDATE_ACTIVITY = 'BROADCAST_UPDATE_ACTIVITY';
export const broadcastUpdateActivity = (activity) => {
	return receiveData(BROADCAST_UPDATE_ACTIVITY, activity);
};

/**
 * 新增文章
 */
export const CREATE_ACTIVITY = 'CREATE_ACTIVITY';
export const createArticle = params => (dispatch, getState) => {
	const activity = getState().activity;
	const streamTarget = activity.personalStream.PERSONALWALL;
	const mockId = getMockId();
	const endorseHoneyPot = params.expectEndorseList.map((item) => {
		return {
			count: 0,
			endorseIt: false,
			item
		};
	});
	const channelInfo = params.channelId ? null : null;
	const fakeActivity = {
		...params,
		aid: mockId,
		aidParent: null,
		pid: getState().user.pid,
		avoidSearched: false,
		channelInfo,
		collectCount: 0,
		collectIt: false,
		collectList: [],
		commentCount: 0,
		commentList: [],
		contentType: 1,
		createDate: new Date().getTime(),
		createDateStr: nowTimeObj(),
		endorseCount: 0,
		endorseHoneyPot,
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
		verb: 1,
		viewCount: 0
	};

	if (!streamTarget[params.pid]) {
		dispatch(initPersonalWall('PERSONALWALL', {targetPid: params.pid}));
	}

	dispatch(broadcastCreateActivity(fakeActivity));
	return dispatch({
		CALL_API: {
			type: CREATE_ACTIVITY,
			method: 'post',
			target: '/activity/create',
			params
		}
	}).then((response) => {

		if (response.response && !response.response.warning) {
			return dispatch(broadcastSwitchActivity(fakeActivity, response.response));
		}
		return dispatch(receiveFail(CREATE_ACTIVITY, response));
	});
};

/**
 * 取得文章
 */
export const GET_ACTIVITY = 'GET_ACTIVITY';
export const getArticle = aid => (dispatch, getState) => {
	const target = getState().activity.activityPool[aid];

	if (!aid) {
		console.log('action getArticle aid fail');
		console.log(getState().user);
		console.log(getState().history);
		return dispatch(
				receiveFail(GET_ACTIVITY, { aid })
			);
	}

	if (target && !target.loading && !target.fail) {
		const article = target;
		dispatch(setMetadata('activity', {
			aid: article.aid,
			author: article.userInfo.userName,
			title: article.title,
			description: stripTags(article.content),
			image: article.extraInfo.attachmentList && article.extraInfo.attachmentList[0] && article.extraInfo.attachmentList[0].activityFileUrl,
			datePublished: moment(article.createDate).tz(moment.tz.guess()).format(),
		}));

		return dispatch(receiveData(GET_ACTIVITY, article, {aid}));
	}

	dispatch(initActivity({aid}));
	return dispatch({
		CALL_API: {
			type: GET_ACTIVITY,
			method: 'get',
			target: '/activity/getActivity',
			params: {
				aidParent: aid,
				aid
			}
		}
	}).then((response) => {
		if (!response.response) {
			dispatch(changeSSRStatus(404));
		}
		if (response.response && response.response.aid) {
			const article = response.response;
			try {
				dispatch(setMetadata('activity', {
					aid: article.aid,
					author: article.userInfo.userName,
					title: article.title,
					description: stripTags(article.content),
					image: article.extraInfo.attachmentList && article.extraInfo.attachmentList[0] && article.extraInfo.attachmentList[0].activityFileUrl,
					datePublished: moment(article.createDate).tz(moment.tz.guess()).format(),
				}));
			} catch (e) {
				console.log(aid);
				console.log(article);
			}

			return dispatch(receiveData(GET_ACTIVITY, response.response, {aid}));
		}
		console.log(`///ActivityFail:${aid}`);
		console.log(response);
		return dispatch(
			receiveFail(GET_ACTIVITY, Object.assign({}, response, { aid }))
		);
	});
};

/**
 * 修改文章
 */
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
export const updateArticle = params => (dispatch, getState) => {
	const oldActivity = getState().activity.activityPool[params.aid];
	const newActivity = JSON.parse(params.activity);
	const fakeActivity = {
		...oldActivity,
		...newActivity
	};

	dispatch(broadcastUpdateActivity(fakeActivity));
	return dispatch({
		CALL_API: {
			type: UPDATE_ACTIVITY,
			method: 'post',
			target: '/activity/update',
			params
		}
	}).then((response) => {
		if (response.response) {
			return dispatch(broadcastUpdateActivity(response.response));
		}
		return dispatch(receiveFail(UPDATE_ACTIVITY, response));
	});
};

/**
 * 刪除文章
 */
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const deleteArticle = activity => (dispatch) => {
	return dispatch({
		CALL_API: {
			type: DELETE_ACTIVITY,
			method: 'post',
			target: '/activity/delete',
			params: {
				aidParent: activity.aid,
				aid: activity.aid
			}
		}
	}).then((response) => {
		if (response.response && response.response === true) {
			return dispatch(broadcastDeleteActivity(activity));
		}
		return dispatch(receiveFail(DELETE_ACTIVITY, response));
	});
};

/**
 * 刪除被檢舉文章
 */
export const deleteAccuseActivity = activity => (dispatch) => {
	return dispatch(broadcastDeleteActivity(activity));
};
