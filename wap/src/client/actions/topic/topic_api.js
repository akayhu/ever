/*
getWorkspaceListHot
getEndorseList
getMediaList
getHonorList
getGroupList
getGalleryList
getRelatedFunction
getEndorsePeopleList
getFollowedList

getSubscribeList
subscribe
unsubscribe
*/

export const GET_WORKSPACE_LIST_HOT = 'GET_WORKSPACE_LIST_HOT';
export const getWorkspaceListHot = params => ({
	CALL_API: {
		type: GET_WORKSPACE_LIST_HOT,
		method: 'get',
		target: '/topic/getWorkspaceListHot',
		params
	}
});

export const GET_ENDORSE_LIST = 'GET_ENDORSE_LIST';
export const getEndorseList = params => ({
	CALL_API: {
		type: GET_ENDORSE_LIST,
		method: 'get',
		target: '/topic/getEndorseList',
		params
	}
});

export const GET_MEDIA_LIST = 'GET_MEDIA_LIST';
export const getMediaList = params => ({
	CALL_API: {
		type: GET_MEDIA_LIST,
		method: 'get',
		target: '/topic/getMediaList',
		params
	}
});

export const GET_HONOR_LIST = 'GET_HONOR_LIST';
export const getHonorList = params => ({
	CALL_API: {
		type: GET_HONOR_LIST,
		method: 'get',
		target: '/topic/getHonorList',
		params
	}
});

export const GET_GROUP_LIST = 'GET_GROUP_LIST';
export const getGroupList = params => ({
	CALL_API: {
		type: GET_GROUP_LIST,
		method: 'get',
		target: '/topic/getGroupList',
		params
	}
});

export const GET_GALLERY_LIST = 'GET_GALLERY_LIST';
export const getGalleryList = params => ({
	CALL_API: {
		type: GET_GALLERY_LIST,
		method: 'get',
		target: '/topic/getGalleryList',
		params
	}
});

export const GET_RELATED_FUNCTION = 'GET_RELATED_FUNCTION';
export const getRelatedFunction = params => ({
	CALL_API: {
		type: GET_RELATED_FUNCTION,
		method: 'get',
		target: '/topic/getRelatedFunction',
		params
	}
});

export const GET_ENDORSE_PEOPLE_LIST = 'GET_ENDORSE_PEOPLE_LIST';
export const getEndorsePeopleList = params => ({
	CALL_API: {
		type: GET_ENDORSE_PEOPLE_LIST,
		method: 'get',
		target: '/topic/getEndorsePeopleList',
		params
	}
});


export const GET_FOLLOWED_LIST = 'GET_FOLLOWED_LIST';
export const getFollowedList = params => ({
	CALL_API: {
		type: GET_FOLLOWED_LIST,
		method: 'get',
		target: '/topic/getFollowedList',
		params
	}
});

export const INIT_GROUP_SECTION = 'INIT_GROUP_SECTION';
export const initGroupSection = params => ({
	CALL_API: {
		type: INIT_GROUP_SECTION,
		method: 'get',
		target: '/topic/initGroupSection',
		params
	}
});

export const INIT_ENDORSE_SECTION = 'INIT_ENDORSE_SECTION';
export const initEndorseSection = params => ({
	CALL_API: {
		type: INIT_ENDORSE_SECTION,
		method: 'get',
		target: '/topic/initEndorseSection',
		params
	}
});

export const INIT_RELATED_SECTION = 'INIT_RELATED_SECTION';
export const initRelatedSection = params => ({
	CALL_API: {
		type: INIT_RELATED_SECTION,
		method: 'get',
		target: '/topic/initRelatedSection',
		params
	}
});

export const INIT_HONOR_SECTION = 'INIT_HONOR_SECTION';
export const initHonorSection = params => ({
	CALL_API: {
		type: INIT_HONOR_SECTION,
		method: 'get',
		target: '/topic/initHonorSection',
		params
	}
});

export const INIT_MEDIA_SECTION = 'INIT_MEDIA_SECTION';
export const initMediaSection = params => ({
	CALL_API: {
		type: INIT_MEDIA_SECTION,
		method: 'get',
		target: '/topic/initMediaSection',
		params
	}
});

export const GET_SUBSCRIBE_LIST = 'GET_SUBSCRIBE_LIST';
export const getSubscribeList = params => ({
	CALL_API: {
		type: GET_SUBSCRIBE_LIST,
		method: 'get',
		target: '/topic/getSubscribeList',
		params
	}
});

export const SUBSCRIBE = 'SUBSCRIBE';
export const subscribe = params => ({
	CALL_API: {
		type: SUBSCRIBE,
		method: 'get',
		target: '/topic/subscribe',
		params
	}
});

export const UNSUBSCRIBE = 'UNSUBSCRIBE';
export const unsubscribe = params => ({
	CALL_API: {
		type: UNSUBSCRIBE,
		method: 'get',
		target: '/topic/unsubscribe',
		params
	}
});
