import { combineReducers } from 'redux';
import createGroupReducer from './createGroupReducer';
import tab from './tab';

/**
 *  tab: {
      all: '知識技術',
      self: '',
      currentChannel: '',
      currentPid: 0,
    },
    all: {
      健康休閒: {...},
      品味生活: {...},
      藝術設計: {...},
      知識技術: {
        categoryId: 1,
        categoryName: '知識技術',
        dataList: [<Array of channelId>],
        loading: false,
        offset: 10,
        total: 45,
        end: false,
        error: false,
        hasLoaded: true,
      },
    },
    self: {
      managed: {...},
      waitForJoin: {...},
      checking: {...},
      rejected: {...},
      joined: {
        dataList: [<Array of channelId>],
        loading: false,
        offset: 10,
        total: 45,
        end: false,
        error: false,
        hasLoaded: true,
      },
    }
 */
const falseKeys = ['joined', 'waitForJoin', 'managed', 'checking', 'rejected', 'activity', 'member'];
const trueKeys = ['joined', 'waitForJoin', 'managed', 'checking', 'rejected'];

export default combineReducers({
	tab,
  // key在falseKeys裡的時候不會進入
	all: createGroupReducer({falseKeys, initialAction: 'initGroupPage', type: 'all'}),
  // key在trueKeys裡的時候才會進入
	self: createGroupReducer({trueKeys, initialAction: 'initMyGroupPage', type: 'self'}),
});

