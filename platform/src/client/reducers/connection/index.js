import * as connectionActions from '../../actions/connection';

export const initState = {
	inviteList: {
		dataList: []
	},
	empty: false
};

export default function connectionReducer(state = initState, action) {
	try {
		switch (action.type) {
			case connectionActions.GET_INVITE_LIST:
				if ( !action.response || !action.response.response) return state;

				const { dataList = [] } = action.response.response;

				return {
					...state,
					inviteList: { dataList },
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
