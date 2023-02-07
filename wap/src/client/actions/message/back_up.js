import Promise from 'bluebird';
import { getIsLoading, getCurrentCount, getDataList, getIsEnd, getReceivedChatId, getLastDateTime } from '../../reducers/message';

export const GET_MESSAGE_LIST = 'GET_MESSAGE_LIST';
export const GET_MESSAGE_LIST_BY_TIME = 'GET_MESSAGE_LIST_BY_TIME';
export const GET_CHAT_LIST = 'GET_CHAT_LIST';
export const GET_CHATROOM_ID = 'GET_CHATROOM_ID';
export const GET_MEMBER_ID_LIST = 'GET_MEMBER_ID_LIST';
export const GET_ALL_CHATROOM_ID_BY_PID = 'GET_ALL_CHATROOM_ID_BY_PID';
export const SET_CHATROOM_STATUS = 'SET_CHATROOM_STATUS';
export const SET_CHATROOM_READED = 'SET_CHATROOM_READED';
export const DELETE_CHATROOM_CONTENT = 'DELETE_CHATROOM_CONTENT';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const SET_CHATROOM_MUTE = 'SET_CHATROOM_MUTE';
export const GET_MESSAGE_BUBBLE_COUNT = 'GET_MESSAGE_BUBBLE_COUNT';
export const GET_MESSAGE_BUBBLE_TIME = 'GET_MESSAGE_BUBBLE_TIME';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const NEW_MESSAGE_WITH_FILE = 'NEW_MESSAGE_WITH_FILE';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const CHANGE_READING_CHAT_ID = 'CHANGE_READING_CHAT_ID';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';
export const INIT_CHAT_ITEM = 'INIT_CHAT_ITEM';
export const SET_READING_CHATID = 'SET_READING_CHATID';
export const ADD_RECEIVER = 'ADD_RECEIVER';
export const DELETE_RECEIVER = 'DELETE_RECEIVER';
export const POST_DATA = 'POST_DATA';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAIL = 'POST_FAIL';
export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const RECEIVE_FAIL = 'RECEIVE_FAIL';
export const REACH_END = 'REACH_END';
// 取得訊息列表
export function getMessageList( params ) {
	return {
		'CALL_API': {
			type: GET_MESSAGE_LIST,
			method: 'get',
			target: '/message/getMessageList',
			params: params
		}
	};
}

// 依照時間取得訊息列表
export function getMessageListByTime( params ) {
	return {
		'CALL_API': {
			type: GET_MESSAGE_LIST_BY_TIME,
			method: 'get',
			target: '/message/getMessageListByTime',
			params: params
		}
	};
}

// 取得個人或團體詳細的對話內容清單
export function getChatList( params ) {
	return {
		'CALL_API': {
			type: GET_CHAT_LIST,
			method: 'get',
			target: '/message/getChatList',
			params: params
		}
	};
}

// 取得聊天室代碼
export function getChatroomId( params ) {
	return {
		'CALL_API': {
			type: GET_CHATROOM_ID,
			method: 'get',
			target: '/message/getChatroomId',
			params: params
		}
	};
}

// 取得聊天室成員列表
export function getMemberIdList( params ) {
	return {
		'CALL_API': {
			type: GET_MEMBER_ID_LIST,
			method: 'get',
			target: '/message/getMemberIdList',
			params: params
		}
	};
}

// 查詢某人所屬的聊天室代碼
export function getAllChatroomIdByPid( params ) {
	return {
		'CALL_API': {
			type: GET_ALL_CHATROOM_ID_BY_PID,
			method: 'get',
			target: '/message/getAllChatroomIdByPid',
			params: params
		}
	};
}

// 設定聊天室狀態，將訊息設定為已讀
export function setChatroomStatus( params ) {
	return {
		'CALL_API': {
			type: SET_CHATROOM_STATUS,
			method: 'get',
			target: '/message/setChatroomStatus',
			params: params
		}
	};
}

export function setChatroomReaded (params) {
	return (dispatch, getState) => {
		dispatch(setChatroomStatus(params)).then(res => {
			if (res.response === true) {
				dispatch({
					type: SET_CHATROOM_READED,
					chatId: params.chatId
				})
			}
		})
	}
}

// 一次刪除整個聊天內容
export function deleteChatroomContent( params ) {
	return {
		'CALL_API': {
			type: DELETE_CHATROOM_CONTENT,
			method: 'get',
			target: '/message/deleteChatroomContent',
			params: params
		}
	};
}

// 刪除多筆或單筆訊息
export function deleteMessage( params ) {
	return {
		'CALL_API': {
			type: DELETE_MESSAGE,
			method: 'get',
			target: '/message/deleteMessage',
			params: params
		}
	};
}

// 設定聊天室靜音
export function setChatroomMute( params ) {
	return {
		'CALL_API': {
			type: SET_CHATROOM_MUTE,
			method: 'get',
			target: '/message/setChatroomMute',
			params: params
		}
	};
}

// 取得訊息泡泡數
export function getMessageBubbleCount( params ) {
	return {
		'CALL_API': {
			type: GET_MESSAGE_BUBBLE_COUNT,
			method: 'get',
			target: '/message/getMessageBubbleCount',
			params: params
		}
	};
}

// 設定讀取訊息泡泡時間
export function setMessageBubbleTime( params ) {
	return {
		'CALL_API': {
			type: GET_MESSAGE_BUBBLE_TIME,
			method: 'get',
			target: '/message/setMessageBubbleTime',
			params: params
		}
	};
}

// 撰寫新訊息（POST）newMessage
export function newMessage( params ) {
	return {
		'CALL_API': {
			type: NEW_MESSAGE,
			method: 'post',
			target: '/message/newMessage',
			params: params
		}
	};
}

// 撰寫新訊息（有附件）newMessageWithFile（POST）
export function newMessageWithFile( params ) {
	return {
		'CALL_API': {
			type: NEW_MESSAGE_WITH_FILE,
			method: 'post',
			target: '/message/newMessageWithFile',
			params: params
		}
	};
}

// 回覆訊息 sendMessage（POST）
export function sendMessage( params ) {
	return {
		'CALL_API': {
			type: SEND_MESSAGE,
			method: 'post',
			target: '/message/sendMessage',
			params: params
		}
	};
}
/*********************************************************/
// 監聽目前開哪個好友對話
export function addReceiver (targetPids) {
	return {
		type: ADD_RECEIVER,
		targetPids
	}
}
export function deleteReceiver () {
	return {
		type: DELETE_RECEIVER
	}
}
export function changeReadingChatId ( chatId ) {
	return (dispatch, getState) => {
		const nowState = getState().message;

		if (!getReceivedChatId(nowState).includes(`${chatId}`)) {
			dispatch(initChatItem(chatId));
		}
		dispatch(setReadingChatId(chatId));
		dispatch(setChatroomReaded({chatId}));

		return Promise.resolve();
	}
}
function initChatItem (chatId) {
	return {
		type: INIT_CHAT_ITEM,
		chatId
	}
}
function setReadingChatId (chatId) {
	return {
		type: SET_READING_CHATID,
		chatId
	}
}

export function postMessage(params) {
	return (dispatch, getState) => {
		dispatch(postData());
		return dispatch(newMessageWithFile(params))
			.then(res => {
				const {status, messageId, chatId} = res.response;
				if (status === 0) {
					dispatch(postFail());
					return Promise.reject();
				} else {
					dispatch(postSuccess());

					const {isNewMessage} = getState().message;
					if (isNewMessage) {
						return dispatch(loadDataByCategory('chatList', {chatId}))
							.then(() => dispatch(loadDataByCategory('updateMessageList')))
							.then(() => dispatch(changeReadingChatId(chatId)))
					}

					dispatch(setChatroomReaded({chatId}))

					return dispatch(loadDataByCategory('chatList', {skipChecking: true, count: 1}))
				}
			})
	}
}

function postData() {
	return {
		type: POST_DATA
	}
}
function postSuccess() {
	return {
		type: POST_SUCCESS
	}
}
function postFail() {
	return {
		type: POST_FAIL
	}
}
function requestData(category, chatId) {
	return {
		type: REQUEST_DATA,
		category,
		chatId
	}
}

function receiveData(category, response, chatId) {
	return {
		type: RECEIVE_DATA,
		category,
		response,
		chatId
	}
}

function receiveFail(category, chatId) {
	return {
		type: RECEIVE_FAIL,
		category,
		chatId
	}
}

function reachEnd(category, chatId) {
	return {
		type: REACH_END,
		category,
		chatId
	}
}

export function initMessagePage() {
	return (dispatch, getState) => {
		return dispatch(loadDataByCategory('messageList'));
	}
}

export function loadDataByCategory(category, options = {}) {
	return (dispatch, getState) => {
		const state = getState().message;
		const chatId = options.chatId || state.readingChatId;
		const count = options.count;

		if (!options.skipChecking) {
			if (canNotLoad(state, category)) { // 載入中則不重覆發action
				return Promise.resolve(); // for return thenable;
			}
		}

		dispatch(requestData(category, chatId));

		const parameters = parameterMap(category, getState, {chatId, count});

		return dispatch(actionMap(category)(parameters)).then(res => {

				const response = res.response;
				if (isWrong(response)) {
					dispatch(receiveFail(category, response, chatId));
				} else {
					if (category === 'chatList') {
						dispatch(receiveData(category, response, chatId));
						dispatch(reachEnd(category, chatId));
					} else {
						const end = !response.hasNext && dispatch(reachEnd(category));
						(!end && dispatch(receiveData(category, response)) )
					}
				}
				return Promise.resolve(response)
			});
	}
}

export function createNewMessage(memberList) {
	if (!memberList) {
		return {
			type: CREATE_NEW_MESSAGE
		}
	}
	return (dispatch) => {
		dispatch({type: CREATE_NEW_MESSAGE});
		dispatch(addReceiver(memberList))
	}

}

export function checkHistory(memberList, chatId) {
	// 有帶入chatId直接呼叫API拿到訊息紀錄
	// 沒有chatId時要先根據memberList拿到chatId，根據得到的chatId去拿訊息紀錄
	// 若訊息紀錄為空陣列代表沒有對話過，則切換到新訊息頁面
	// 有訊息紀錄則顯示歷史訊息
	return (dispatch) => {
		if (chatId) {
			dispatch(loadDataByCategory('chatList', {chatId}))
		} else {
			let chatId;
			dispatch(getChatroomId({memberList}))
			.then(res => {
				chatId = res.response.chatId;
				return dispatch(loadDataByCategory('chatList', {chatId}))
			})
			.then(chatList => chatList.length === 0
				? dispatch(createNewMessage(memberList))
				: dispatch(changeReadingChatId(chatId))
			)
		}
	}
}

// utils
function actionMap(category) {
	switch (category) {
		case 'messageList':
		case 'updateMessageList':
			return getMessageListByTime;
		case 'chatList':
			return getChatList;
		default:
			return a => a
	}
}

function parameterMap(category, getState, {chatId, count}) {
	const nowState = getState().message;

	switch (category) {
		case 'messageList':
			return {
				count: 15,
				dateTime: getLastDateTime(nowState)
			}
		case 'updateMessageList':
			return {
				count: 1,
				dateTime: nowTimeObj()
			}
		case 'chatList':
			return {
				chatId: chatId,
				count: count || 1000,
				dateTime: nowTimeObj()
			}
		default:
			return {}
	}
}
// utils
const isWrong = (obj) => Object.keys(obj).includes('error') || Object.keys(obj).includes('warning')
const canNotLoad = (state, category) => getIsLoading(state, category) ||  getIsEnd(state, category)
const nowTimeObj = () => {
	const date = new Date(),
			year = date.getFullYear(), // 年
			month = date.getMonth() + 1, // 月
			day = date.getDate(), // 日
			hours = date.getHours(), // 時
			minutes = date.getMinutes(), // 分
			seconds = date.getSeconds(); // 秒

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 年-月-日 時:分:秒;
}
