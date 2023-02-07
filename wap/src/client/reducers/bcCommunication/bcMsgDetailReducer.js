import * as BCCommunicationActionType from '../../actions/bcCommunication';

export const initState = {
	bcCommMsgInfo: {},
	msgDetailList: [],
	pageNo: 0,
	pageRow: 0,
	totalCnt: 0,
	totalPage: 0
};

export default function bcMsgDetailReducer(state = initState, action) {
	try{
		switch (action.type) {
			case BCCommunicationActionType.GET_MSG_DETAIL: 
				if (action.response === null || !action.response.response) return state;
				const {bcCommMsgInfo, msgDetailList, pageNo, pageRow, totalCnt, totalPage} = action.response.response;
				return {...state, bcCommMsgInfo, msgDetailList, pageNo, pageRow, totalCnt, totalPage};
			
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
