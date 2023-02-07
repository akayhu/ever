import * as ccCommunicationActions from '../../actions/ccCommunication';

export const initState = {
	messageList: {
		dataList: []
	},
	empty: false
};

export default function bcCommunicationReducer(state = initState, action) {
	try {
		switch (action.type) {
			case ccCommunicationActions.GET_MESSAGE_LIST:
				if (action.response === null || !action.response.response) return state;

				const { dataList = [] } = action.response.response;

				return {
					...state,
					messageList: { dataList },
					empty: (!dataList.length) ? true : false
				};
			default:
				return state;
		}
	} catch(e) {
		console.log(e);
		return state;
	}
};
