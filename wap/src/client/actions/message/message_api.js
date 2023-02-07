export const GET_MESSAGE_LIST = 'GET_MESSAGE_LIST';
export const GET_MESSAGE_LIST_BY_TIME = 'GET_MESSAGE_LIST_BY_TIME';
export const GET_CHAT_LIST = 'GET_CHAT_LIST';
export const GET_CHATROOM_ID = 'GET_CHATROOM_ID';
export const GET_MEMBER_ID_LIST = 'GET_MEMBER_ID_LIST';
export const GET_ALL_CHATROOM_ID_BY_PID = 'GET_ALL_CHATROOM_ID_BY_PID';
export const SET_CHATROOM_STATUS = 'SET_CHATROOM_STATUS';
export const DELETE_CHATROOM_CONTENT = 'DELETE_CHATROOM_CONTENT';
export const DELETE_CHATROOM_BY_ID_FROM_LIST = 'DELETE_CHATROOM_BY_ID_FROM_LIST';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const SET_CHATROOM_MUTE = 'SET_CHATROOM_MUTE';
export const GET_MESSAGE_BUBBLE_COUNT = 'GET_MESSAGE_BUBBLE_COUNT';
export const GET_MESSAGE_BUBBLE_TIME = 'GET_MESSAGE_BUBBLE_TIME';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const NEW_MESSAGE_WITH_FILE = 'NEW_MESSAGE_WITH_FILE';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MIX_LIST = 'GET_MIX_LIST';
export const GET_CHATROOM_MUTE_STATUS = 'GET_CHATROOM_MUTE_STATUS';

export function deleteChatroomByIdFromList( chatId ) {
	return {
		type: DELETE_CHATROOM_BY_ID_FROM_LIST,
		chatId: chatId,
		category: 'messageList'
	};
}

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
export function getMixList(params) {
	return {
		CALL_API: {
			type: GET_MIX_LIST,
			method: 'get',
			target: '/message/getMixList',
			params
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

// 取得聊天是靜音狀態 getChatroomMuteStatus(GET)
export function getChatroomMuteStatus(params) {
	return {
		CALL_API: {
			type: GET_CHATROOM_MUTE_STATUS,
			target: '/message/getChatroomMuteStatus',
			method: 'get',
			params
		}
	}
}
