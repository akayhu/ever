import * as SearchActions from 'src/client/actions/search';

export default function tab(state = 'activity', action) {
  switch (action.type) {
    case SearchActions.CHANGE_SEARCH_TAB: {
      return action.payload.tab;
    }
    default:
      return state;
  }
}
