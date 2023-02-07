import * as BCCommunicationActionType from '../../actions/bcCommunication';

export const initState = {
	msgListData: [],
	pageNo: 0,
	pageRow: 0,
	totalCnt: 0,
	totalPage: 0
};

export default function bcMsgListReducer(state = initState, action) {
	try{
		switch (action.type) {
			case BCCommunicationActionType.GET_MSG_LIST: 
				if (action.response === null || !action.response.response) return state;
				const {msgListData, pageNo, pageRow, totalCnt, totalPage} = action.response.response;
				const newList = [...state.msgListData, ...msgListData];

				return {...state, pageNo, pageRow, totalCnt, totalPage, msgListData: newList};

			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
