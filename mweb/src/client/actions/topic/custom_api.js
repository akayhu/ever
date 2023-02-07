import * as TopicApi from './topic_api';
import {
	loadListDataCenter,
	receiveFail,
} from 'src/client/actions/general';
import {isWrong} from 'src/util/checkTools';

/**
 * 在這裡打的action的paylord domain會是'topic', toEntity會是'topics'
 */
const domain = 'topic';
const toEntity = 'topics';

/**
 * 當topic要取得到非PageModel的資料使用的
 * 目前用於
 * 	-	請求訂閱列表(getSubscribeList)的資料
 *
 * @param {object} {domain, key, ...option} - 內涵domain, key, 其餘的會被放入option中
 */
export const REQUEST_TOPIC_DATA = 'REQUEST_TOPIC_DATA';
export const requestTopicData = ({domain, key, ...option}) => ({
	type: REQUEST_TOPIC_DATA,
	payload: {domain, key, ...option},
});

/**
 * 當topic接收到非PageModel的資料使用的
 * 目前用於
 * 	-	得到訂閱列表(getSubscribeList)的回傳資料
 *
 * @param {object} {domain, key, ...option} - 內涵domain, key, 其餘的會被放入option中
 */
export const RECEIVE_TOPIC_DATA = 'RECEIVE_TOPIC_DATA';
export const receiveTopicData = ({domain, key, ...option}) => ({
	type: RECEIVE_TOPIC_DATA,
	payload: {domain, key, ...option},
});

/**
 * 取得使用者訂閱的職務類別
 */
export const initSubscribeList = () => (dispatch, getState) => {
	const key = 'initList';
	const hasLoaded = getState().topic.allFunc.hasLoaded;
	const isLoading = getState().topic.allFunc.loading;

	if (!isLoading && !hasLoaded) {
		dispatch(requestTopicData({domain, key}));
		return dispatch(TopicApi.getSubscribeList()).then((response) => {
			if (isWrong(response)) {
				return dispatch(receiveFail({domain, key}));
			}
			
			if (!response.response) {
				return dispatch(receiveFail({domain, key}));
			}
			
			if (!Array.isArray(response.response)) {
				return dispatch(receiveFail({domain, key}));
			}
			
			const source = response.response.map(item => item.function);
			return dispatch(receiveTopicData({domain, key, source}));
		});
	}
};

/**
 * 切換職務列表時用的
 * 1. 發出切換職務類別的action (改變state.topic.func)
 * 2. 判斷state.topic.byFunc[func]是否有資料了
 *  - 若無，發出initTopicModel的action (改變state.topic.byFunc[func])
 *
 * @param {string} func - 職務類別名稱
 */
export const CHANGE_FUNC = 'CHANGE_FUNC';
export const changeTopic = func => (dispatch, getState) => {
	dispatch({
		type: CHANGE_FUNC,
		payload: {func},
	});
	if (!getState().topic.byFunc[func]) {
		dispatch(initTopicModel(func));
	}
	return Promise.resolve(`change func to ${func}`);
};

/**
 * 初始化state.topic.byFunc[func]
 * 目前只有changeTopic這個action會用到
 *
 * @param {string} func - 職務類別名稱
 */
export const INIT_TOPIC_MODEL = 'INIT_TOPIC_MODEL';
export const initTopicModel = func => ({
	type: INIT_TOPIC_MODEL,
	payload: {domain, key: 'initTopicModel', option: {func}},
});


/**
 * 職場動態頁初始用
 * 1. 判斷state.topic.func是否相同
 * 		- 不相同，changeTopic
 * 2. 判斷state.topic.byFunc[func].hots是否已載入(目前職場動態頁只有熱門文章)
 * 		- 若無，載入熱門文章
 *
 * @param {string} func - 職務類別名稱
 */
export const INIT_TOPIC_PAGE = 'INIT_TOPIC_PAGE';
export const initTopicPage = func => (dispatch, getState) => {
	if (getState().topic.func !== func) {
		dispatch(changeTopic(func));
	}
	if (!getState().topic.byFunc[func].hots.hasLoaded) {
		return dispatch(loadListDataCenter({domain, key: 'hots', func}));
	}
	return Promise.resolve(`success initTopicPage to ${func}`);
};
