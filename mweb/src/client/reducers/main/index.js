import {combineReducers} from 'redux';
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
	hot: createList({domain: 'main', key: 'hot'}),

  // action.payload帶有domain: 'main', key: 'latest'才會進入
	latest: createList({domain: 'main', key: 'latest'}),

  // action.payload帶有domain: 'main', key: 'all'才會進入
	all: createList({domain: 'main', key: 'all'}),
  
  welcomeHtml: (state=null, action) => {
    return state;
  },
});

export const getMainTab = state => state.tab;
export const getMainDataByKey = (state, key, infoType) => {
	if (infoType) return state[key][infoType];
	return state[key];
};
