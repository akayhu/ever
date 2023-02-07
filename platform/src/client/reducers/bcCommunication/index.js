import * as bcCommunicationActions from '../../actions/bcCommunication';

export const initState = {
	msgList: {
		msgListData: [],
	},
	empty: false
};

export default function bcCommunicationReducer(state = initState, action) {
	try {
		switch (action.type) {
			case bcCommunicationActions.GET_MSG_LIST:
				if (!action.response || !action.response.response) return state;

				const { msgListData = [] } = action.response.response;

				return {
					...state,
					msgList: { msgListData },
					empty: (!msgListData.length) ? true : false
				};
			default:
				return state;
		}
	} catch(e) {
		console.log(e);
		return state;
	}
};
