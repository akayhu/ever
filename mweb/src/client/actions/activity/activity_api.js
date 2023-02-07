// constants
export const LOADED_PROFILE_GALLERY_SORT = 'LOADED_PROFILE_GALLERY_SORT';
export const GET_PERSONAL_RIVER_ALL = 'GET_PERSONAL_RIVER_ALL';
export const GET_PERSONAL_RIVER_HOT = 'GET_PERSONAL_RIVER_HOT';
export const GET_PERSONAL_RIVER_NEW = 'GET_PERSONAL_RIVER_NEW';
export const GET_ACTIVITY_LIST_BY_CHANNEL = 'GET_ACTIVITY_LIST_BY_CHANNEL';
export const GET_PERSONAL_WALL = 'GET_PERSONAL_WALL';
export const LIKE = 'LIKE';
export const UNLIKE = 'UNLIKE';
export const REMOVE_COLLECT = 'REMOVE_COLLECT';
export const COLLECT = 'COLLECT';
export const GET_ACTIVITY = 'GET_ACTIVITY';
export const GET_COMMENT_LIST = 'GET_COMMENT_LIST';
export const GET_RELATIVE_ACTIVITY = 'GET_RELATIVE_ACTIVITY';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const ADD_ENDORSEMENT = 'ADD_ENDORSEMENT';
export const DELETE_ENDORSEMENT = 'DELETE_ENDORSEMENT';
export const VIEW_ACYIVITY = 'VIEW_ACYIVITY';

// action creators
export const loadProfileGallerySort = params => ({
	CALL_API: {
		type: LOADED_PROFILE_GALLERY_SORT,
		method: 'get',
		target: '/profile/profileGallery/getGallerySortList',
		params,
	},
});

export const getPersonalRiverAll = params => ({
	CALL_API: {
		type: GET_PERSONAL_RIVER_ALL,
		method: 'get',
		target: '/activity/getPersonalRiverAll',
		params,
	},
});

export const getPersonallRiverHot = params => ({
	CALL_API: {
		type: GET_PERSONAL_RIVER_HOT,
		method: 'get',
		target: '/activity/getPersonalRiverHot',
		params,
	},
});

export const getPersonallRiverNew = params => ({
	CALL_API: {
		type: GET_PERSONAL_RIVER_NEW,
		method: 'get',
		target: '/activity/getPersonalRiverNew',
		params,
	},
});

export const getActivityListByChannel = params => ({
	CALL_API: {
		type: GET_ACTIVITY_LIST_BY_CHANNEL,
		method: 'get',
		target: '/group/getActivityListByChannel',
		params,
	},
});

export const getPersonalWall = params => ({
	CALL_API: {
		type: GET_PERSONAL_WALL,
		method: 'get',
		target: '/activity/getPersonalWall',
		params,
	},
});

export const getActivity = params => ({
	CALL_API: {
		type: GET_ACTIVITY,
		method: 'get',
		target: '/activity/getActivity',
		params,
	},
});

export const getCommentList = params => ({
	'CALL_API': {
		type: GET_COMMENT_LIST,
		method: 'get',
		target: '/activity/getCommentList',
		params,
	}
})

export const getRelatedActivity = params => ({
	'CALL_API': {
		type: GET_RELATIVE_ACTIVITY,
		method: 'get',
		target: '/activity/getRelatedActivity',
		params
	}
})

export const createComment = params => ({
	'CALL_API': {
		type: CREATE_COMMENT,
		method: 'post',
		target: '/activity/createComment',
		params
	}
})

export const like = params => ({
	CALL_API: {
		type: LIKE,
		method: 'post',
		target: '/activity/like',
		params,
	},
});

export const unlike = params => ({
	CALL_API: {
		type: UNLIKE,
		method: 'post',
		target: '/activity/unlike',
		params,
	},
});

export const collect = params => ({
	CALL_API: {
		type: COLLECT,
		method: 'post',
		target: '/activity/collect',
		params,
	},
});

export const removeCollect = params => ({
	CALL_API: {
		type: REMOVE_COLLECT,
		method: 'post',
		target: '/activity/removecollect',
		params,
	},
});

export const addEndorse = params => ({
	CALL_API: {
			type: ADD_ENDORSEMENT,
			method: 'post',
			target: '/activity/addEndorse',
			params
		}
});

export const deleteEndorse = params => ({
	CALL_API: {
			type: DELETE_ENDORSEMENT,
			method: 'post',
			target: '/activity/delEndorser',
			params
		}
});


export const viewActivity = aid =>  ({
	CALL_API: {
		type: VIEW_ACYIVITY,
		method: 'post',
		target: '/activity/viewActivity',
		params: {
			aid: aid
		}
	}
});