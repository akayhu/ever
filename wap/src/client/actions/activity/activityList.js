import {requestData, receiveListData, receiveCount, receiveFail} from './queryTool';


// 個人文章初始化
export const INIT_PERSONAL_WALL = 'INIT_PERSONAL_WALL';
export const INIT_MYCOLLECT_WALL = 'INIT_MYCOLLECT_WALL';
export const INIT_GALLERY_WALL = 'INIT_GALLERY_WALL';
export const INIT_CHANNEL_WALL = 'INIT_CHANNEL_WALL';
export const INIT_GROUP_WALL = 'INIT_GROUP_WALL';
export const initPersonalWall = (category, params) => {
	switch (category) {
		case 'PERSONALWALL': {
			return {
				type: INIT_PERSONAL_WALL,
				params
			};
		}
		case 'MYCOLLECT': {
			return {
				type: INIT_MYCOLLECT_WALL,
				params
			};
		}
		case 'GALLERY': {
			return {
				type: INIT_GALLERY_WALL,
				params
			};
		}
		case 'CHANNEL': {
			return {
				type: INIT_CHANNEL_WALL,
				params
			};
		}
		case 'GROUP': {
			return {
				type: INIT_GROUP_WALL,
				params
			};
		}
		default: {
			return {
				type: INIT_PERSONAL_WALL,
				params
			};
		}
	}
};

// 首頁文章
export const GET_PERSONAL_RIVER_HOT = 'GET_PERSONAL_RIVER_HOT';
export const GET_PERSONAL_RIVER_NEW = 'GET_PERSONAL_RIVER_NEW';
export const GET_PERSONAL_RIVER_ALL = 'GET_PERSONAL_RIVER_ALL';
export const GET_PERSONAL_WALL = 'GET_PERSONAL_WALL';
export const GET_PERSONAL_COLLECT = 'GET_PERSONAL_COLLECT';
export const GET_PERSONAL_GALLERY = 'GET_PERSONAL_GALLERY';
export const GET_CHANNEL_WALL = 'GET_CHANNEL_WALL';
export const GET_GROUP_WALL = 'GET_GROUP_WALL';
export const getPersonalWall = (category, params = {}) => (dispatch, getState) => {
	const activity = getState().activity;
	let streamTarget = activity.personalStream[category];

	if (params.hasOwnProperty('targetPid')) {
		if (!streamTarget[params.targetPid]) {
			dispatch(initPersonalWall(category, params));
			streamTarget = getState().activity.personalStream[category];
		}

		streamTarget = streamTarget[params.targetPid];
	} else if (params.hasOwnProperty('channelId')) {
		if (!streamTarget[params.channelId]) {
			dispatch(initPersonalWall(category, params));
			streamTarget = getState().activity.personalStream[category];
		}

		streamTarget = streamTarget[params.channelId];
	}

	if (!streamTarget.loading && !streamTarget.end) {
		dispatch(requestData(category, params));
		return getPersonalRiverData[category](dispatch, getState, params);
	}
	return Promise.resolve();
};

const getPersonalRiverData = {
	PERSONALWALL(dispatch, getState, params) {
		return dispatch({
			CALL_API: {
				type: GET_PERSONAL_WALL,
				method: 'get',
				target: '/activity/getPersonalWall',
				params: {
					targetPid: params.targetPid,
					limit: params.limit || 10,
					ts: getState().activity.personalStream.PERSONALWALL[params.targetPid].ts
				}
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_PERSONAL_WALL, response.response, params));
			}
			return dispatch(receiveFail(GET_PERSONAL_WALL, response));
		});
	},
	MYCOLLECT(dispatch, getState, params) {
		return dispatch({
			CALL_API: {
				type: GET_PERSONAL_COLLECT,
				method: 'get',
				target: '/activity/getCollectList',
				params: {
					targetPid: params.targetPid,
					limit: params.limit || 10,
					ts: getState().activity.personalStream.MYCOLLECT[params.targetPid].ts
				}
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_PERSONAL_COLLECT, response.response, params));
			}
			return dispatch(receiveFail(GET_PERSONAL_COLLECT, response));
		});
	},
	GALLERY(dispatch, getState, params) {
		return dispatch({
			CALL_API: {
				type: GET_PERSONAL_GALLERY,
				method: 'get',
				target: '/profile/profileGallery/getGalleryList',
				params: {
					targetPid: params.targetPid,
					limit: params.limit || 10,
					offset: getState().activity.personalStream.GALLERY[params.targetPid].offset
				}
			}
		}).then((response) => {
			if (response.response) {
				response.response.activityList = response.response.dataList;
				return dispatch(receiveListData(GET_PERSONAL_GALLERY, response.response, params));
			}
			return dispatch(receiveFail(GET_PERSONAL_GALLERY, response));
		});
	},
	HOT(dispatch, getState, params) {
		return dispatch({
			CALL_API: {
				type: GET_PERSONAL_RIVER_HOT,
				method: 'get',
				target: '/activity/getPersonalRiverHot',
				params: {
					limit: params.limit || 10,
					stickey: getState().activity.personalStream.HOT.stickey,
					oriQuery: getState().activity.personalStream.HOT.oriQuery
				}
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_PERSONAL_RIVER_HOT, response.response));
			}
			return dispatch(receiveFail(GET_PERSONAL_RIVER_HOT, response));
		});
	},
	NEW(dispatch, getState, params) {
		return dispatch({
			CALL_API: {
				type: GET_PERSONAL_RIVER_NEW,
				method: 'get',
				target: '/activity/getPersonalRiverNew',
				params: {
					limit: params.limit || 10,
					stickey: getState().activity.personalStream.NEW.stickey,
					oriQuery: getState().activity.personalStream.NEW.oriQuery
				}
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_PERSONAL_RIVER_NEW, response.response));
			}
			return dispatch(receiveFail(GET_PERSONAL_RIVER_NEW, response));
		});
	},
	ALL(dispatch, getState, params) {
		return dispatch({
			CALL_API: {
				type: GET_PERSONAL_RIVER_ALL,
				method: 'get',
				target: '/activity/getPersonalRiverAll',
				params: {
					limit: params.limit || 10,
					ts: getState().activity.personalStream.ALL.ts
				}
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_PERSONAL_RIVER_ALL, response.response));
			}
			return dispatch(receiveFail(GET_PERSONAL_RIVER_ALL, response));
		});
	},
	CHANNEL(dispatch, getState, params) {
		return dispatch({
			CALL_API: {
				type: GET_CHANNEL_WALL,
				method: 'get',
				target: '/group/getActivityListByChannel',
				params: {
					channelId: params.channelId,
					limit: params.limit || 10,
					offset: getState().activity.personalStream.CHANNEL[params.channelId].offset
				}
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_CHANNEL_WALL, response.response, params));
			}
			return dispatch(receiveFail(GET_CHANNEL_WALL, response));
		});
	},
	GROUP(dispatch, getState, params) {
		const apiParams = {
			channelId: params.channelId,
			limit: params.limit || 10,
			offset: getState().activity.personalStream.GROUP[params.channelId].offset
		};

		if (params.sortField) {
			apiParams.sortField = params.sortField;
		}

		if (params.order) {
			apiParams.order = params.order;
		}

		return dispatch({
			CALL_API: {
				type: GET_GROUP_WALL,
				method: 'get',
				target: '/group/getActivityListByChannel',
				params: apiParams
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_GROUP_WALL, response.response, params));
			}
			return dispatch(receiveFail(GET_GROUP_WALL, response));
		});
	}
};

// 可能有興趣的文章
export const GET_RELATIVE_ACTIVITY = 'GET_RELATIVE_ACTIVITY';
export const getRelativeActivity = activity => (dispatch, getState) => {
	const activityState = getState().activity;
	const streamTarget = activityState.activityPool[activity.aid];

	if (!streamTarget.relativeLoading && !streamTarget.relativeEnd) {
		dispatch(requestData('RELATIVE_ACTIVITY', activity));
		return dispatch({
			CALL_API: {
				type: GET_RELATIVE_ACTIVITY,
				method: 'get',
				target: '/activity/getRelatedActivity',
				params: {
					aid: activity.aid
				}
			}
		}).then((response) => {
			if (response.response) {
				return dispatch(receiveListData(GET_RELATIVE_ACTIVITY, {activityList: response.response}, activity));
			}
			return dispatch(receiveFail(GET_RELATIVE_ACTIVITY, response));
		});
	}
	return Promise.resolve();
};

// 文章總數
export const GET_ACTIVITY_COUNT_BY_PIDS = 'GET_ACTIVITY_COUNT_BY_PIDS';
export const getPersonalWallCount = params => (dispatch, getState) => {
	const streamTarget = getState().activity.personalStream.PERSONALWALL;

	if (!streamTarget[params.targetPid]) {
		dispatch(initPersonalWall('PERSONALWALL', params));
	}

	return dispatch({
		CALL_API: {
			type: GET_ACTIVITY_COUNT_BY_PIDS,
			method: 'get',
			target: '/activity/getActivityCountByPids',
			params: {
				pids: params.targetPid
			}
		}
	}).then((response) => {
		if (response.response) {
			return dispatch(receiveCount(GET_ACTIVITY_COUNT_BY_PIDS, response.response, params));
		}
		return dispatch(receiveFail(GET_ACTIVITY_COUNT_BY_PIDS, response));
	});
};

// 收藏總數
export const GET_COLLECT_COUNT = 'GET_COLLECT_COUNT';
export const getMyCollectCount = params => (dispatch, getState) => {
	const streamTarget = getState().activity.personalStream.MYCOLLECT;

	if (!streamTarget[params.targetPid]) {
		dispatch(initPersonalWall('MYCOLLECT', params));
	}

	return dispatch({
		CALL_API: {
			type: GET_COLLECT_COUNT,
			method: 'get',
			target: '/activity/getMyCollectCount',
			params
		}
	}).then((response) => {
		if (response.response) {
			return dispatch(receiveCount(GET_COLLECT_COUNT, response.response, params));
		}
		return dispatch(receiveFail(GET_COLLECT_COUNT, response));
	});
};
