import * as ChannelActions from 'src/client/actions/channel';

const initialState = {
	all: '',
	self: '',
	currentChannel: '',
	channelId: 0,
};

export default function tab(state = initialState, action) {
	switch (action.type) {
		case ChannelActions.CHANGE_CHANNEL_TAB: {
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
