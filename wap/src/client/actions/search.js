import {receiveListData, receiveFail} from "../actions/activity";

export const SEARCH_PERSON = 'SEARCH_PERSON';
export function searchPerson(params) {
	return {
		'CALL_API': {
			type: SEARCH_PERSON,
			method: 'get',
			target: '/search/searchPerson',
			params: params
		}
	};
};

export const SEARCH_BY_KEYWORD = 'SEARCH_BY_KEYWORD';
export const searchByKeyword = (params) => (dispatch, getState) => {
	return dispatch({
		'CALL_API': {
			type: SEARCH_BY_KEYWORD,
			method: 'get',
			target: '/search/searchByKeyword',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(receiveListData(SEARCH_BY_KEYWORD, response.response, params));
		}else{
			return dispatch(receiveFail(SEARCH_BY_KEYWORD, response));
		}
	});
};

export const SEARCH_BY_TAG = 'SEARCH_BY_TAG';
export const searchByTag = (params) => (dispatch, getState) => {
	return dispatch({
		'CALL_API': {
			type: SEARCH_BY_TAG,
			method: 'get',
			target: '/search/searchByTag',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(receiveListData(SEARCH_BY_TAG, response.response, params));
		}else{
			return dispatch(receiveFail(SEARCH_BY_TAG, response));
		}
	});
};

export const SEARCH_BY_KEYWORD_AT_PUBLIC_CHANNEL = 'SEARCH_BY_KEYWORD_AT_PUBLIC_CHANNEL';
export const searchByKeywordAtPublicChannel = (params) => (dispatch, getState) => {
	return dispatch({
		'CALL_API': {
			type: SEARCH_BY_KEYWORD_AT_PUBLIC_CHANNEL,
			method: 'get',
			target: '/search/searchByKeywordAtPublicChannel',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(receiveListData(SEARCH_BY_KEYWORD_AT_PUBLIC_CHANNEL, response.response, params));
		}else{
			return dispatch(receiveFail(SEARCH_BY_KEYWORD_AT_PUBLIC_CHANNEL, response));
		}
	});
};

export const SEARCH_BY_KEYWORD_AT_PRIVAYE_CHANNEL = 'SEARCH_BY_KEYWORD_AT_PRIVAYE_CHANNEL';
export const searchByKeywordAtPrivateChannel = (params) => (dispatch, getState) => {
	return dispatch({
		'CALL_API': {
			type: SEARCH_BY_KEYWORD_AT_PRIVAYE_CHANNEL,
			method: 'get',
			target: '/search/searchByKeywordAtPrivateChannel',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(receiveListData(SEARCH_BY_KEYWORD_AT_PRIVAYE_CHANNEL, response.response, params));
		}else{
			return dispatch(receiveFail(SEARCH_BY_KEYWORD_AT_PRIVAYE_CHANNEL, response));
		}
	});
};
export const SEARCH_BY_KEYWORD_AT_AUTHOR = 'SEARCH_BY_KEYWORD_AT_AUTHOR';
export const searchByKeywordAtAuthor = (params) => (dispatch, getState) => {
	return dispatch({
		'CALL_API': {
			type: SEARCH_BY_KEYWORD_AT_AUTHOR,
			method: 'get',
			target: '/search/searchByKeywordAtAuthor',
			params: params
		}
	}).then((response) => {
		if(response.response){
			return dispatch(receiveListData(SEARCH_BY_KEYWORD_AT_AUTHOR, response.response, params));
		}else{
			return dispatch(receiveFail(SEARCH_BY_KEYWORD_AT_AUTHOR, response));
		}
	});
};

export const SEARCH_GROUP_BY_KEYWORD = 'SEARCH_GROUP_BY_KEYWORD';
export function searchGroupByKeyword(params) {
	return {
		'CALL_API': {
			type: SEARCH_GROUP_BY_KEYWORD,
			method: 'get',
			target: '/search/searchGroupByKeyword',
			params: params
		}
	};
};

export const SEARCH_MEDIA_BY_KEYWORD = 'SEARCH_MEDIA_BY_KEYWORD';
export function searchMediaByKeyword(params) {
	return {
		'CALL_API': {
			type: SEARCH_MEDIA_BY_KEYWORD,
			method: 'get',
			target: '/search/searchMediaByKeyword',
			params: params
		}
	};
};

export const SUBSCRIBE_SEARCHED_MEDIA = 'SUBSCRIBE_SEARCHED_MEDIA';
export const subscribeMedia = params => (dispatch, getState) => {
	return dispatch({
		CALL_API: {
			type: 'SUBSCRIBE_MEDIA',
			method: 'post',
			target: '/mediaChannel/subscribeMedia',
			params: { channelId: params.channelId }
		}
	}).then((response) => {
		if (response.response) return dispatch({ type: SUBSCRIBE_SEARCHED_MEDIA, index: params.index });
	});
};
