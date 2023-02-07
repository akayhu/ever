import Promise from 'bluebird';
import { newMessageWithFile, getChatroomId, setChatroomStatus, setChatroomMute, getChatroomMuteStatus } from './message_api';
import { isWrong, canNotLoad, actionMap, parameterMap } from './utils';
// selectors
import { getReceivedChatId } from '../../reducers/message/selectors';
// constants
export const CHANGE_READING_CHAT_ID = 'CHANGE_READING_CHAT_ID';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';
export const INIT_CHAT_ITEM = 'INIT_CHAT_ITEM';
export const SET_READING_CHATID = 'SET_READING_CHATID';
export const SET_CHATROOM_READED = 'SET_CHATROOM_READED';
export const ADD_RECEIVER = 'ADD_RECEIVER';
export const DELETE_RECEIVER = 'DELETE_RECEIVER';
export const POST_DATA = 'POST_DATA';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAIL = 'POST_FAIL';
export const POST_WARNING = 'POST_WARNING';
export const REQUEST_DATA = 'MESSAGE:REQUEST_DATA';
export const RECEIVE_DATA = 'MESSAGE:RECEIVE_DATA';
export const RECEIVE_FAIL = 'MESSAGE:RECEIVE_FAIL';
export const REACH_END = 'MESSAGE:REACH_END';
export const ADD_CHAT_ITEM = 'ADD_CHAT_ITEM';
export const CLEAR_CHAT = 'CLEAR_CHAT';
export const SET_CHATROOM_MUTE_STATUS = 'SET_CHATROOM_MUTE_STATUS';

// action creators
export function changeReadingChatId(chatId) {
	return (dispatch, getState) => {
		const nowState = getState().message;
		const msg = nowState.messageList.dataList.find(msg =>{
			return parseInt(msg.chatId) === parseInt(chatId)
		});
		// if (!msg || msg.muteFlag === undefined) {
		// 	dispatch(getChatroomMuteStatus({chatId})).then(res => {
		// 		dispatch(setChatroomMuteStatus({chatId, muteFlag: res.response}));
		// 	})
		// }
		if (!getReceivedChatId(nowState).includes(`${chatId}`)) {
			dispatch(initChatItem(chatId));
		}
		dispatch(setReadingChatId(chatId));
		dispatch(setChatroomReaded({chatId}));

		return Promise.resolve();
	};
}

export function postMessage(params) {
	return (dispatch, getState) => {
		dispatch(postData());
		return dispatch(newMessageWithFile(params))
			.then((res) => {
				const {status, messageId, chatId} = res.response;

				if (status === 0) {
					dispatch(postFail());
					return Promise.resolve();
				}

				if (res.response.hasOwnProperty('warning')) {
					dispatch(postWarning(res.response));
					return Promise.resolve();
				}

				dispatch(postSuccess());
				const {isNewMessage} = getState().message;

				if (isNewMessage) {
					return setTimeout(()=> dispatch(loadDataByCategory('updateMessageList'))
						.then(() => dispatch(changeReadingChatId(chatId))), 1000);
				}

				dispatch(setChatroomReaded({chatId}));

				return dispatch(loadDataByCategory('chatList', {
					skipChecking: true,
					count: 1,
					success: addChatItem
				}));
			});
	};
}

export function addChatItem(category, response, chatId) {
	return {
		type: ADD_CHAT_ITEM,
		category,
		response,
		chatId,
	};
}

export function clearChat(category, chatId) {
	return {
		type: CLEAR_CHAT,
		chatId,
		category
	};
}

export function createNewMessage(memberList) {
	return (dispatch) => {
		dispatch({type: CREATE_NEW_MESSAGE});
		if( memberList ) dispatch(addReceiver(memberList));
	};
}

export function addReceiver(targetPids) {
	return {
		type: ADD_RECEIVER,
		targetPids
	};
}

export function deleteReceiver() {
	return {
		type: DELETE_RECEIVER
	};
}

function initChatItem(chatId) {
	return {
		type: INIT_CHAT_ITEM,
		category: 'chatList',
		chatId
	};
}

function setReadingChatId(chatId) {
	return {
		type: SET_READING_CHATID,
		chatId
	};
}

function setChatroomReaded(params) {
	return (dispatch) => {
		dispatch(setChatroomStatus(params)).then((res) => {
			if (res.response === true) {
				dispatch({
					type: SET_CHATROOM_READED,
					chatId: params.chatId
				});
			}
		});
	};
}

function postData() {
	return {
		type: POST_DATA
	};
}

function postSuccess() {
	return {
		type: POST_SUCCESS
	};
}

function postFail() {
	return {
		type: POST_FAIL
	};
}

function postWarning(response) {
	return {
		type: POST_WARNING,
		response
	};
}

function requestData(category, chatId) {
	return {
		type: REQUEST_DATA,
		category,
		chatId
	};
}

function receiveData(category, response, chatId) {
	return {
		type: RECEIVE_DATA,
		category,
		response,
		chatId
	};
}

function receiveFail(category, chatId) {
	return {
		type: RECEIVE_FAIL,
		category,
		chatId
	};
}

function reachEnd(category, chatId) {
	return {
		type: REACH_END,
		category,
		chatId
	};
}

export function initMessagePage() {
	return dispatch => dispatch(loadDataByCategory('messageList'));
}

export function loadDataByCategory(category, options = {}) {
	return (dispatch, getState) => {
		const state = getState().message;
		const chatId = options.chatId || state.readingChatId;
		const count = options.count;

		if (!options.skipChecking && category !== 'updateMessageList') {
			if (canNotLoad(state, category)) { // 載入中則不重覆發action
				return Promise.resolve(); // for return thenable;
			}
		}

		dispatch(requestData(category, chatId));

		const parameters = parameterMap(category, getState, {chatId, count});

		return dispatch(actionMap(category)(parameters)).then((res) => {
			const response = res.response || {};
			if (isWrong(response)) {
				dispatch(receiveFail(category, response, chatId));
			} else if (category === 'chatList') {
				if (options.success) {
					dispatch(options.success(category, response, chatId));
				} else {
					dispatch(receiveData(category, response, chatId));
				}
				// getChatList這隻API的回傳內容無法知道有沒有後續資料...
				// dispatch(reachEnd(category, chatId));
			} else {
				const end = !response.hasNext && dispatch(reachEnd(category));
				(!end && dispatch(receiveData(category, response)));
			}
			return Promise.resolve(response);
		});
	};
}

export function checkHistory({memberList, chatId}) {
	// 有帶入chatId直接呼叫API拿到訊息紀錄
	// 沒有chatId時要先根據memberList拿到chatId，根據得到的chatId去拿訊息紀錄
	// 若訊息紀錄為空陣列代表沒有對話過，則切換到新訊息頁面
	// 有訊息紀錄則顯示歷史訊息
	return (dispatch) => {
		if (chatId) {
			dispatch(loadDataByCategory('chatList', {chatId})).then(() => {
				dispatch(changeReadingChatId(chatId));
			});
		} else {
			let chatId;
			dispatch(getChatroomId({memberList}))
			.then((res) => {
				chatId = res.response.chatId;
				return dispatch(loadDataByCategory('chatList', {chatId}));
			})
			.then(chatList => !chatList || chatList.length === 0 
				? dispatch(createNewMessage(memberList))
				: dispatch(changeReadingChatId(chatId))
			);
		}
	};
}

// 設定聊天室靜音的狀態(用來修改store裡的messageList)
export function setChatroomMuteStatus({chatId, muteFlag}) {
	return {
		type: SET_CHATROOM_MUTE_STATUS,
		category: 'updateMessageList',
		chatId, muteFlag
	}
}

// 設定聊天室靜音的狀態(呼叫後端API以及修改store裡的messageList)
export function triggerSetChatroomMute(params) {
	return (dispatch) => {
		dispatch(setChatroomMuteStatus(params));
		return dispatch(setChatroomMute(params));
	}
}