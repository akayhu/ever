import { combineReducers } from 'redux';
import * as BubblesActions from '../../actions/bubbles';
import * as pusherActions from '../../actions/pusher';

export const initState = {
  connectionBubbleCount: 0,
  bcCommunicationCount: 0,
  messageBubbleCount: 0,
  notificationBubbleCount: 0
};

const bubbles = (state = initState, action) => {
  try {
    switch (action.type) {
      case BubblesActions.GET_BUBBLE_COUNT: {
        if (action.response === null) return state;
        
        const {
          connectionBubbleCount,
          bcCommunicationCount,
          messageBubbleCount
        } = action.response;

        return {
          ...state,
          connectionBubbleCount,
          bcCommunicationCount,
          messageBubbleCount
        };
      }
      case BubblesActions.UPDATE_BUBBLE: {
        return {
          ...state,
          [action.targetBubble]: state[action.targetBubble] + 1
        };
      }
      case BubblesActions.CLEAR_BUBBLE: {
        return {
          ...state,
          [action.targetBubble]: 0
        };
      }
      case BubblesActions.GET_UNREAD_NOTIFY: {
        return {
          ...state,
          notificationBubbleCount: action.response.response
        };
      }
      case pusherActions.PUSHER_MESSAGE_RECEIVED: {
        return {
          ...state,
          notificationBubbleCount: (action.msg)
          ? state.notificationBubbleCount + 1
          : state.notificationBubbleCount
        };
      }
      default:
        return state;
    }
  } catch(e) {
    console.log(e);
    return state;
  }
}

export default bubbles;
