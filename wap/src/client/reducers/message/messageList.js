import {
	REQUEST_DATA,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REACH_END,
	SET_CHATROOM_READED,
	DELETE_CHATROOM_BY_ID_FROM_LIST,
	SET_CHATROOM_MUTE_STATUS
} from '../../actions/message';


export const initialState = {
	dataList: [],
	error: false,
	loading: false,
	end: false,
	count: 0,
	dateTime: ''
};

const MessageList = (state = initialState, action) => {
	try{
		const { category } = action;
		if (category !== 'updateMessageList' && category !== 'messageList')
			return state;

		switch (action.type) {
			case REQUEST_DATA: {
				return {...state,
					loading: true
				};
			}
			case RECEIVE_DATA: {
				const { response: {dataList} } = action;
				const isUpdate = category === 'updateMessageList';
				const newDataList = isUpdate
					? [...dataList, ...state.dataList]
					: [...state.dataList, ...dataList];
				return {...state,
					dataList: newDataList,
					loading: false,
					count: newDataList.length,
					dateTime: newDataList[newDataList.length - 1].inputDate
				};
			}
			case RECEIVE_FAIL: {
				return {...state,
					error: true,
					loading: false
				};
			}
			case REACH_END: {
				return {...state,
					end: true,
					loading: false
				};
			}
			case SET_CHATROOM_READED: {
				return {...state,
					dataList: state.dataList.map((message) => {
						if (message.chatId === action.chatId)
							return {...message, isRead: 1};
						return message;
					})
				};
			}
			case DELETE_CHATROOM_BY_ID_FROM_LIST: {
				return {...state,
					dataList: state.dataList.filter((message) => {
						return message.chatId !== action.chatId;
					})
				};
			}
			case SET_CHATROOM_MUTE_STATUS: {
				const {chatId, muteFlag} = action;
				return {...state,
					dataList: state.dataList.map(message =>{
						if (message.chatId == chatId) {
							return {...message, muteFlag};
						}
						return message;
					})
				}
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};

export default MessageList;
