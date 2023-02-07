import {
	REQUEST_DATA,
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REACH_END,
	INIT_CHAT_ITEM,
	ADD_CHAT_ITEM,
	CLEAR_CHAT
} from '../../actions/message';

export const initialState = {
	dataList: [],
	error: false,
	loading: false,
	end: false,
	count: 0,
	dateTime: ''
};

export default function chatItem(state = initialState, action) {
	try {
		const { type, response } = action;

		switch (type) {
			case REQUEST_DATA: {
				return {...state,
					loading: true
				};
			}
			case RECEIVE_DATA: {
				if (!response.length) return {
					...state,
					loading: false
				};

				/**
				 * 這邊當初撰寫考量不周，只考慮了往上捲要load more而沒有考慮到新訊息近來的情形
				 * 由於後來把message的load功能拔掉，因此這邊就改成只做新訊息近來的功能
				 * 未來如果有需要做load more功能再做處理
				 */

				const newDataList = state.count ?
					[...state.dataList, ...response.slice(state.count, response.length)] :
					[...response];

				return {...state,
					dataList: newDataList,
					loading: false,
					count: newDataList.length,
					dateTime: newDataList[0].inputDate
				};
			}

			case RECEIVE_FAIL:
				return {...state,
					error: true,
					loading: false
				};
			case REACH_END:
				return {...state,
					end: true,
					loading: false
				};
			case ADD_CHAT_ITEM: {
				return {
					...state,
					dataList: state.dataList.concat(response),
					count: state.dataList.length + 1,
					dateTime: response.inputDate,
					loading: false
				};
			}
			case INIT_CHAT_ITEM:
				return initialState;
			case CLEAR_CHAT: {
				return initialState;
			}
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
}
