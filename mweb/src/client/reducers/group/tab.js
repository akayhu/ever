import * as GroupActions from 'src/client/actions/group';

const initialState = {
	all: '',
	self: '',
	currentChannel: '',
	channelId: 0,
};

export default function tab(state = initialState, action) {
	switch (action.type) {
		case GroupActions.CHANGE_GROUP_TAB: {
			const {tab, subDomain, channelId} = action.payload;
			if (subDomain === 'currentChannel') {
				return {
					...state,
					[subDomain]: tab,
					channelId,
				};
			}
			return {
				...state,
				[subDomain]: tab,
			};
		}
		default:
			return state;
	}
}
