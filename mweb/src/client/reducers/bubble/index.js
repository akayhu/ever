import { GET_BUBBLE_COUNT, CLEAR_BUBBLE } from 'src/client/actions/bubble';
import { PUSHER_MESSAGE_RECEIVED } from 'c_platform/lib/client/actions/pusher';

export const initState = {
	bubbleCount: 0,
};

const bubbles = (state = initState, action) => {
	try {
		switch (action.type) {
			case GET_BUBBLE_COUNT: {
				if (!action.response || !action.response.response || action.response.error) return state;

				return {
					...state,
					bubbleCount: action.response.response,
				};
			}
			case PUSHER_MESSAGE_RECEIVED: {
				return {
					...state,
					bubbleCount: (action.msg) ? state.bubbleCount + 1 : state.bubbleCount,
				};
			}
			case CLEAR_BUBBLE: {
				return initState;
			}
			default:
				return state;
		}
	} catch (e) {
		console.log(e);
		return state;
	}
};

export default bubbles;
