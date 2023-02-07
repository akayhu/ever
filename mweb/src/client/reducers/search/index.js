import { combineReducers } from 'redux';
import createList from 'src/client/reducers/listReducer';
import tab from './tab';

/*
initialState = {
  tab: 'hot',
  hot: {
    dataList: [],
    loading: false,
    error: false,
    end: false,
    hasLoaded: false,
    offset: {}
  },
  latest: {
    dataList: [],
    loading: false,
    error: false,
    end: false,
    hasLoaded: false,
    offset: {}
  },
  all: {
    dataList: [],
    loading: false,
    error: false,
    end: false,
    hasLoaded: false,
    offset: 0
  }
}
*/

export default combineReducers({
	tab,
	// action.payload帶有domain: 'main', key: 'hot'才會進入
	activity: createList({domain: 'search', key: 'activity'}),

  // action.payload帶有domain: 'main', key: 'latest'才會進入
	person: createList({domain: 'search', key: 'person'}),
});

export const getSearchTab = state => state.tab;
export const getSearchDataByKey = (state, key, infoType) => {
	if (infoType) return state[key][infoType];
	return state[key];
};