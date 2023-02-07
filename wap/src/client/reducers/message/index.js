import { combineReducers } from 'redux';
import chatList from './chatList';
import messageList from './messageList';
import postMessage from './postMessage';
import readingChatId from './readingChatId';
import isNewMessage from './isNewMessage';
import messageTo from './messageTo';

export default combineReducers({
	chatList,
	messageList,
	postMessage,
	readingChatId,
	isNewMessage,
	messageTo
});
// import * as MessageActionType from 'src/client/actions/message';
// import { getCurrentCount } from './selectors';
// /* ********** initial state for chatList ********** */
// const initChatListState = {
// 	dataList: [],
// 	error: false,
// 	loading: false,
// 	end: false,
// 	count: 0
// };
// /* ********** initial state for MessageList ********** */
// const initMessageListState = {
// 	dataList: [],
// 	error: false,
// 	loading: false,
// 	end: false,
// 	count: 0,
// 	lastDateTime: ''
// };
//
// function chatItem(state, action) {
// 	const { type, category, response, chatId } = action;
//
// 	switch (type) {
// 		case MessageActionType.REQUEST_DATA:
// 			return {
// 				[chatId]: Object.assign({}, state[category][chatId], {
// 					loading: true
// 				})
// 			};
// 		case MessageActionType.RECEIVE_DATA:
// 			return {
// 				[chatId]: Object.assign({}, state[category][chatId], {
// 					dataList: response,
// 					loading: false,
// 					count: getCurrentCount(state, category) + response.length,
// 				})
// 			};
// 		case MessageActionType.RECEIVE_FAIL:
// 			return {
// 				[chatId]: Object.assign({}, state[category][chatId], {
// 					error: true,
// 					loading: false
// 				})
// 			};
// 		case MessageActionType.REACH_END:
// 			return {
// 				[chatId]: Object.assign({}, state[category][chatId], {
// 					end: true
// 				})
// 			};
// 		case MessageActionType.INIT_CHAT_ITEM:
// 			return {
// 				[chatId]: initChatListState
// 			};
// 		default:
// 			return {
// 				[chatId]: state[category][chatId]
// 			};
// 	}
// }
//
// export const initState = {
// 	messageList: initMessageListState,
// 	chatList: {
// 		0: initChatListState
// 	},
// 	readingChatId: 0,
// 	isNewMessage: false,
// 	messageTo: [],
// 	postMessage: {
// 		loading: false,
// 		error: false
// 	}
// };
//
// export default function messageReducer(state = initState, action) {
// 	let category = null;
//
// 	switch (action.type) {
// 		case MessageActionType.REQUEST_DATA:
// 			category = action.category;
// 			if (category === 'updateMessageList' || category === 'messageList') {
// 				return Object.assign({}, state, {
// 					messageList: Object.assign({}, state.messageList, {
// 						loading: true
// 					})
// 				});
// 			} else if (category === 'chatList') {
// 				return Object.assign({}, state, {
// 					[category]: Object.assign({}, state[category], chatItem(state, action))
// 				});
// 			}
// 			return state;
// 		case MessageActionType.RECEIVE_DATA: {
// 			category = action.category;
// 			const { response: {dataList} } = action;
// 			switch (category) {
// 				case 'messageList':
// 					return Object.assign({}, state, {
// 						[category]: Object.assign({}, state[category], {
// 							dataList: [...state[category].dataList, ...dataList],
// 							loading: false,
// 							count: getCurrentCount(state, category) + dataList.length,
// 							lastDateTime: dataList[dataList.length - 1].inputDate
// 						})
// 					});
// 				case 'updateMessageList':
// 					return Object.assign({}, state, {
// 						messageList: Object.assign({}, state.messageList, {
// 							dataList: [...dataList, ...state.messageList.dataList],
// 							loading: false,
// 							count: getCurrentCount(state, 'messageList') + 1
// 						})
// 					});
// 				case 'chatList':
// 					return Object.assign({}, state, {
// 						[category]: Object.assign({}, state[category], chatItem(state, action))
// 					});
// 				default:
// 					return state;
// 			}
// 		}
//
// 		case MessageActionType.RECEIVE_FAIL:
// 			category = action.category;
//
// 			switch (category) {
// 				case 'messageList':
// 				case 'updateMessageList':
// 					return Object.assign({}, state, {
// 						messageList: Object.assign({}, state.messageList, {
// 							error: true,
// 							loading: false
// 						})
// 					});
// 				case 'chatList':
// 					return Object.assign({}, state, {
// 						[category]: Object.assign({}, state[category], chatItem(state, action))
// 					});
// 				default:
// 					return state;
// 			}
//
// 		case MessageActionType.REACH_END:
// 			category = action.category;
//
// 			switch (category) {
// 				case 'messageList':
// 				case 'updateMessageList':
// 					return Object.assign({}, state, {
// 						messageList: Object.assign({}, state.messageList, {
// 							end: true,
// 							loading: false
// 						})
// 					});
// 				case 'chatList':
// 					return Object.assign({}, state, {
// 						[category]: Object.assign({}, state[category], chatItem(state, action))
// 					});
// 				default:
// 					return state;
// 			}
//
// 		case MessageActionType.POST_DATA:
// 			return Object.assign({}, state, {
// 				postMessage: Object.assign({}, state.postMessage, {
// 					loading: true
// 				})
// 			});
//
// 		case MessageActionType.POST_SUCCESS:
// 			return Object.assign({}, state, {
// 				postMessage: Object.assign({}, state.postMessage, {
// 					loading: false,
// 					error: false
// 				})
// 			});
//
// 		case MessageActionType.POST_FAIL:
// 			return Object.assign({}, state, {
// 				postMessage: Object.assign({}, state.postMessage, {
// 					error: true
// 				})
// 			});
//
// 		/* ************************************************************** */
// 		case MessageActionType.INIT_CHAT_ITEM:
// 			return Object.assign({}, state, {
// 				chatList: Object.assign({}, state.chatList, chatItem(state, action))
// 			});
//
// 		case MessageActionType.CREATE_NEW_MESSAGE:
// 			return Object.assign({}, state, {
// 				isNewMessage: true,
// 				readingChatId: 0
// 			});
//
// 		case MessageActionType.ADD_RECEIVER:
// 			return Object.assign({}, state, {
// 				messageTo: [...state.messageTo, ...action.targetPids]
// 			});
//
// 		case MessageActionType.DELETE_RECEIVER:
// 			return Object.assign({}, state, {
// 				messageTo: []
// 			});
//
// 		case MessageActionType.SET_READING_CHATID:
// 			return Object.assign({}, state, {
// 				readingChatId: action.chatId,
// 				isNewMessage: false,
// 				messageTo: []
// 			});
//
// 		case MessageActionType.SET_CHATROOM_READED:
// 			return Object.assign({}, state, {
// 				messageList: Object.assign({}, state.messageList, {
// 					dataList: state.messageList.dataList.map(message => {
// 						if (message.chatId === action.chatId) {
// 							return Object.assign(message, {isRead: 1});
// 						}
// 						return message;
// 					})
// 				})
// 			});
//
// 		default:
// 			return state;
// 	}
// }
