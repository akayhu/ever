import * as MainActions from 'src/client/actions/main';

export default function tab(state = 'hot', action) {
  switch (action.type) {
    case MainActions.CHANGE_MAIN_TAB: {
      return action.payload.tab;
    }
    default:
      return state;
  }
}