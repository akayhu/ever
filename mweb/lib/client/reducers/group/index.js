'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _redux=require('redux');var _createGroupReducer=require('./createGroupReducer');var _createGroupReducer2=_interopRequireDefault(_createGroupReducer);var _tab=require('./tab');var _tab2=_interopRequireDefault(_tab);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
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
 */var falseKeys=['joined','waitForJoin','managed','checking','rejected','activity','member'];var trueKeys=['joined','waitForJoin','managed','checking','rejected'];exports.default=(0,_redux.combineReducers)({tab:_tab2.default,// key在falseKeys裡的時候不會進入
all:(0,_createGroupReducer2.default)({falseKeys:falseKeys,initialAction:'initGroupPage',type:'all'}),// key在trueKeys裡的時候才會進入
self:(0,_createGroupReducer2.default)({trueKeys:trueKeys,initialAction:'initMyGroupPage',type:'self'})});