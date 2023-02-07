export * from './channel_api';
export * from './custom_api';

// export * from './channel_api';

// import { getCurrentOffset, getHasNext, getIsLoading } from '../../reducers/channel';
// import * as ChannelApi from './channel_api';
// import Promise from 'bluebird';

// export const ON_ADD_MEDIA_ROLE = 'ON_ADD_MEDIA_ROLE';

// export const CHANGE_LIST_TAB = 'CHANGE_LIST_TAB';

// export const RECEIVE_DATA = 'CHANNEL_RECEIVE_DATA';
// export const REQUEST_DATA = 'REQUEST_DATA';
// export const ADD_WAIT_FOR_RESET = 'ADD_WAIT_FOR_RESET';
// export const CLEAR_DATA = 'CHANNEL_CLEAR_DATA';
// export const COUNT_TOTAL = 'COUNT_TOTAL';

// export const TRIGGET_SEARCH = 'TRIGGET_SEARCH';
// export const UPDATE_MEDIA_INFO = 'UPDATE_MEDIA_INFO';

// export const CHANGE_MEMBER_TAB = 'CHANGE_MEMBER_TAB';

// export const onAddMediaRole = ({ targetPid, channelId, role }) => dispatch =>
// 	dispatch(ChannelApi.addMediaRole({ targetPid, channelId, role })).then((res) => {
// 		if (res.response) {
// 			dispatch(changeMediaRole(targetPid, channelId, role));
// 			return true;
// 		}
// 		return false;
// 	});

// export const onRemoveMediaRole = ({ targetPid, channelId, role }) => dispatch =>
// 	dispatch(ChannelApi.deleteMediaRole({ targetPid, channelId })).then((res) => {
// 		if (res.response) {
// 			dispatch(changeMediaRole(targetPid, channelId, role));
// 			return true;
// 		}
// 		return false;
// 	});

// export const changeMemberTab = tab => dispatch =>
// 	dispatch({type: CHANGE_MEMBER_TAB, tab});

// export const saveChannelUpdate = params => dispatch =>
// 	dispatch(ChannelApi.updateMedia(params)).then((res) => {
// 		dispatch({
// 			type: UPDATE_MEDIA_INFO,
// 			tab: 'mediaInfo',
// 			response: res.response
// 		});
// 	});

// export function triggetSearch(text) {
// 	return (dispatch) => {
// 		dispatch({type: TRIGGET_SEARCH, text});
// 	};
// }

// export function changeListTab(tab) {
// 	return (dispatch, getState) => {
// 		const state = getState().channel.channelList;
// 		dispatch({type: CHANGE_LIST_TAB, tab});
// 		if (state[tab].waitForReset) {
// 			dispatch(clearData(tab));
// 			dispatch(loadDataCenter(tab, 'init'));
// 		}
// 		return Promise.resolve();
// 	};
// }

// export function loadDataCenter(tab, init, options = {}) {
// 	return (dispatch, getState) => {
// 		const state = getState().channel;

// 		if (!init) { // 要init時就會直接跳過檢核
// 			if (getHasNext(state, tab) === false || getIsLoading(state, tab)) {
// 				return Promise.resolve();
// 			}
// 		}

// 		if (init) {
// 			dispatch(clearData(tab));
// 		}

// 		const parameters = parameterMap(tab, getState, options);
// 		dispatch(requestData(tab));

// 		return dispatch(actionMap(tab)(parameters)).then((res) => {
// 			const response = res.response;
// 			if (!isWrong(response)) {
// 				return dispatch(receiveData(tab, response));
// 			}
// 			return null;
// 		});
// 	};
// }

// export function triggerSubscribeMedia(params, haveReload = false, status = false) {
// 	return (dispatch, getState) => {
// 		const state = getState().channel.channelList;
// 		if (haveReload) {
// 			dispatch(addWaitForReset(state.tab));
// 		}
// 		if (status) {
// 			if (state.joined.total === 1) { // 當完全無已加入的頻道時，把tab切回推薦頻道
// 				dispatch(changeListTab('recommend'));
// 			}
// 			dispatch(countTotal('joined', state.joined.total, -1)); // -1是讓navbar把已加入的頻道隱藏
// 			return dispatch(ChannelApi.unsubscribeMedia(params));
// 		}
// 		dispatch(countTotal('joined', state.joined.total, 1)); // +1是讓navbar把已加入的頻道顯示
// 		return dispatch(ChannelApi.subscribeMedia(params));
// 	};
// }

// export function actionMap(tab) {
// 	switch (tab) {
// 		case 'recommend':
// 			return ChannelApi.getMediaList;
// 		case 'all':
// 			return ChannelApi.getMediaList;
// 		case 'joined':
// 			return ChannelApi.getSubscribeMediaList;
// 		case 'mediaInfo':
// 			return ChannelApi.getMediaInfo;
// 		// case 'channelActivity':
// 		// 	return ChannelApi.getActivityListByChannel;
// 		case 'channelMember':
// 			return ChannelApi.getMediaMemberList;
// 		case 'mediaNewActivity':
// 			return ChannelApi.getMediaListByNewActivity;
// 		default:
// 			throw Error(`no match tab, ${tab}`);
// 	}
// }

// export function parameterMap(tab, getState, options = {}) {
// 	const state = getState && getState().channel;
// 	switch (tab) {
// 		case 'recommend':
// 			return {
// 				limit: 10,
// 				offset: getCurrentOffset(state, tab),
// 				func: ''
// 			};
// 		case 'all':
// 			return {
// 				limit: 10,
// 				offset: getCurrentOffset(state, tab)
// 			};
// 		case 'joined':
// 			return {
// 				limit: 10,
// 				offset: getCurrentOffset(state, tab)
// 			};
// 		// case 'channelActivity':
// 		// 	return {
// 		// 		channelId: options.channelId,
// 		// 		limit: 10,
// 		// 		offset: getCurrentOffset(state, tab)
// 		// 	};
// 		case 'channelMember':
// 			return {
// 				channelId: options.channelId,
// 				limit: 10,
// 				offset: getCurrentOffset(state, tab)
// 			};
// 		default:
// 			return options;
// 	}
// }

// // api response 錯誤handle
// const isWrong = (obj) => {
// 	if (!obj) return true;
// 	if (Object.prototype.toString.call(obj) !== '[object Object]') {
// 		return false;
// 	}
// 	return {}.hasOwnProperty.call(obj, 'error') || {}.hasOwnProperty.call(obj, 'warning');
// };

// // 接到回應
// const receiveData = (tab, response) => ({
// 	type: RECEIVE_DATA,
// 	tab,
// 	response
// });

// // 發出ajax請求
// const requestData = (tab, response) => ({
// 	type: REQUEST_DATA,
// 	tab,
// 	response
// });

// // 已關注頻道 需不需要重新reload
// const addWaitForReset = tab => ({
// 	type: ADD_WAIT_FOR_RESET,
// 	tab
// });

// // 清空data
// const clearData = tab => ({
// 	type: CLEAR_DATA,
// 	tab
// });

// // 計算total數量 為了隱藏或顯示navBar
// const countTotal = (tab, total, count) => ({
// 	type: COUNT_TOTAL,
// 	tab,
// 	total,
// 	count
// });

// const changeMediaRole = (targetPid, channelId, role) => ({
// 	type: ON_ADD_MEDIA_ROLE,
// 	targetPid,
// 	channelId,
// 	role,
// 	tab: 'channelMember'
// });
