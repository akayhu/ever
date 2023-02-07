import {isEmpty} from 'lodash/lang';
import * as TopicApi from './topic_api';
import {
	isErrorInput,
	notLoadData,
	parameterMap,
	actionMap,
	getIdsAndByIds,
	extractFromNestedData,
	requestWrapper,
} from './utils';
import {isWrong} from '../../../util/tools';
import {getInfoByKey} from '../../reducers/topic/selectors';

export const CHANGE_FUNC = 'TOPIC::CHANGE_FUNC';
export const REQUEST_DATA = 'TOPIC::REQUEST_DATA';
export const INIT_TOPIC_PAGE = 'TOPIC::INIT_TOPIC_PAGE';
export const GET_DATA = 'TOPIC::GET_DATA';
export const GET_INITIAL_DATA = 'TOPIC::GET_INITIAL_DATA';
export const SET_SHOULDRESET = 'TOPIC::SET_SHOULDRESET';
export const SET_ISERROR = 'TOPIC::SET_ISERROR';
export const SET_ISEND = 'TOPIC::SET_ISEND';
export const TRIGGER_SUBSCRIBE = 'TRIGGER_SUBSCRIBE';
export const TRIGGER_UNSUBSCRIBE = 'TRIGGER_UNSUBSCRIBE';

export function initStaffList(key, subkey, options) {
	return (dispatch, getState) => {
		if (getState().topic.func) {
			const {func} = getState().topic;
			if (key === 'endorse') return;
			// 為了產生model
			dispatch({type: INIT_TOPIC_PAGE, payload: {func}});
			// 判斷此func的endorse是否已經存在項目 (從子首頁來或切換職能)
			if (isEmpty(getInfoByKey(getState(), 'endorse'))) {
				dispatch(loadDataCenter({key: 'initialEndorse'}));
			}
			dispatch(loadDataCenter({key, subkey, options}));
			return;
		}
		// topic.func沒有職能時才做getSubscribeList
		dispatch(TopicApi.getSubscribeList()).then((res) => {
			if(res.response){
				const func = res.response[0].function;
				dispatch(changeFunc(func));
				// 為了產生model
				dispatch({type: INIT_TOPIC_PAGE, payload: {func}});
			}
			dispatch(loadDataCenter({key: 'initialEndorse'}));
			if (key === 'endorse') return;
			dispatch(loadDataCenter({key, subkey, options}));
		});
	};
}

export function initArticleList(key, subkey, options) {
	return (dispatch, getState) => {
		// topic.func沒有職能時才做getSubscribeList
		if (getState().topic.func) {
			// 為了產生model
			dispatch(loadDataCenter({key, subkey, options}));
			return;
		}
		dispatch(TopicApi.getSubscribeList()).then((res) => {
			// 還沒處理沒有職務類別的情境
			if(res.response){
				const func = res.response[0].function;
				dispatch(changeFunc(func));
				// 為了產生model
				dispatch({type: INIT_TOPIC_PAGE, payload: {func}});
			}
			dispatch(loadDataCenter({key, subkey, options}));
		});
	};
}

function initData(dispatch) {
	const requestHelper = requestWrapper(5000)(dispatch, loadDataCenter);
	requestHelper([
		{key: 'news', subkey: 'hots'},
		{key: 'followed'},
		{key: 'initialEndorse'},
		{key: 'initialRelated'},
		{key: 'gallery'},
		{key: 'initialHonor'},
		{key: 'group'},
		{key: 'channel'}
	]);
}

function loadTopicP(func, dispatch, dontInitData) {
	return new Promise((resolve) => {
		dispatch(changeFunc(func));
		dispatch({type: INIT_TOPIC_PAGE, payload: {func}});
		if (!dontInitData) {
			initData(dispatch);
		}
		resolve();
	});
}
export function initTopicPage(paramsTopic) {
	return (dispatch, getState) => {
		const {func, byFunc} = getState().topic;
		const loadedList = Object.keys(byFunc);
		const isSubscribeListLoaded = loadedList.length > 0;
		// 必做1.切職務類別 2.若不存在要init 和 取得資料
		const getSubscribeTask = isSubscribeListLoaded ?
			() => Promise.resolve() :
			() => dispatch(TopicApi.getSubscribeList()).then(({response}) => response ? response[0].function : '');

		return getSubscribeTask().then((firstTopic) => {
			// paramsTopic有質，代表示網址直衝，要優先
			const topicShouldLoad = paramsTopic || firstTopic || func;
			const dontInitData = loadedList.indexOf(topicShouldLoad) !== -1;
			return loadTopicP(topicShouldLoad, dispatch, dontInitData);
		});
	};
}
export function changeFunc(func) {
	return {
		type: CHANGE_FUNC,
		payload: {func}
	};
}

export function requestData({func, key, subkey}) {
	if (isErrorInput(key, subkey)) return {};

	return {
		type: REQUEST_DATA,
		payload: {func, key, subkey}
	};
}

export function getData({func, key, subkey, ids, byIds, info}) {
	if (isErrorInput(key, subkey)) return {};
	// 當載入initialEndorse時候，info才會有資料
	return {
		type: GET_DATA,
		payload: {func, key, subkey, ids, byIds, info}
	};
}

export function getInitialData(key) {
	return {
		type: GET_INITIAL_DATA,
		payload: {key}
	};
}

export function setShouldReset({func, key, subkey, shouldReset}) {
	if (isErrorInput(key, subkey)) return {};
	return {
		type: SET_SHOULDRESET,
		payload: {func, key, subkey, shouldReset}
	};
}

export function setIsError({func, key, subkey, isError}) {
	if (isErrorInput(key, subkey)) return {};
	return {
		type: SET_ISERROR,
		payload: {func, key, subkey, isError}
	};
}

export function setIsEnd({func, key, subkey, isEnd}) {
	if (isErrorInput(key, subkey)) return {};
	return {
		type: SET_ISEND,
		payload: {func, key, subkey, isEnd}
	};
}

// 爛扣QQ已哭，不要看
export function loadDataCenter({key, subkey, options}) {
	return (dispatch, getState) => {
		const state = getState();
		const {func} = state.topic;
		const _key = transKey(key);

		if (notLoadData(state, key, subkey)) {
			return Promise.resolve();
		}

		const parameters = parameterMap(state, key, subkey, options);

		dispatch(requestData({func, key, subkey}));

		return dispatch(actionMap(key)(parameters)).then((res) => {
			const response = res.response;

			if (isWrong(response)) {
				dispatch(setIsError({func, key, subkey, isError: true}));
				return Promise.resolve(`error --- ${key}`);
			}

			const nestedData = ['initialEndorse', 'initialRelated'].indexOf(key) !== -1;

			if (['initialEndorse', 'initialRelated', 'initialHonor'].indexOf(key) !== -1)
				dispatch(getInitialData(key));

			if (nestedData) {
				const _response = extractFromNestedData(response);
				const _subkey = Object.keys(_response);

				for (let i = 0; i < _subkey.length; i += 1) {
					const {dataList, hasNext, id, count} = _response[_subkey[i]];
					const {byIds, ids} = getIdsAndByIds(dataList, key);
					// 當載入initialEndorse時候，info才會有資料
					const info = _key === 'endorse' ? {id, count} : null;

					dispatch(getData({func, key: _key, subkey: _subkey[i], ids, byIds, info}));
					if (hasNext === false)
						dispatch(setIsEnd({func, key: _key, subkey: _subkey[i], isEnd: true}));
				}
			} else {
				const {hasNext} = response;
				let data;
				if (_key === 'news') {
					data = response.activityList;
				} else {
					data = response.dataList;
				}
				const {byIds, ids} = getIdsAndByIds(data, _key);
				dispatch(getData({func, key: _key, subkey, ids, byIds}));
				if (hasNext === false)
					dispatch(setIsEnd({func, key: _key, subkey, isEnd: true}));
			}
			return Promise.resolve(`success --- ${key}`);
		});
	};
}

export function triggerSubscribe(func) {
	return (dispatch) => {
		dispatch(TopicApi.subscribe({func})).then((res) => {
			const response = res.response;
			if (!isWrong(response)) {
				dispatch({
					type: TRIGGER_SUBSCRIBE,
					payload: {func}
				});
			}
		});
	};
}

export function triggerUnsubscribe(func) {
	return (dispatch) => {
		dispatch(TopicApi.unsubscribe({func})).then((res) => {
			const response = res.response;
			if (!isWrong(response)) {
				dispatch({
					type: TRIGGER_UNSUBSCRIBE,
					payload: {func}
				});
			}
		});
	};
}

/* ********************************* */
function transKey(key) {
	if (key === 'initialEndorse') {
		return 'endorse';
	} else if (key === 'initialRelated') {
		return 'related';
	} else if (key === 'initialHonor') {
		return 'honor';
	}
	return key;
}
