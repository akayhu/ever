import * as SearchActionType from '../actions/search';
import * as GroupActionType from '../actions/group';
import * as ChannelActionType from '../actions/channel';

export const initState = {
	person: {
    dataList: [],
    total: 0,
  },
	activity:{
		activityList:[],
		stickey:"",
		oriQuery:"",
		nextPage:false,
		totalHits: 0
	},
	group: {
		dataList: [],
    total: 0,
	},
	channel: {
		dataList: [],
    total: 0,
	}
};

export default function searchReducer(state = initState, action){
	try{
		switch(action.type){
			case ChannelActionType.SEARCH_MEDIA_MEMBER:
			case GroupActionType.SEARCH_GROUP_MEMBER:
			case SearchActionType.SEARCH_PERSON:
				if (action.response === null || !action.response.response) return state;
				//res = getResponse(action.response);

				// if ( action.response.response === null ) {
				// 	res.response = {};
				// 	res.response.dataList = [];
				// 	res.response.total = 0;
				// }

				// state.person = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {person: action.response.response});

			case SearchActionType.SEARCH_GROUP_BY_KEYWORD:
				if (action.response === null || !action.response.response) return state;
				// res = getResponse(action.response);

				// if ( res.response === null ) {
				// 	res.response = {};
				// 	res.response.dataList = [];
				// 	res.response.total = 0;
				// }

				// state.group = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {group: action.response.response});

			case SearchActionType.SEARCH_MEDIA_BY_KEYWORD:
				if (action.response === null || !action.response.response) return state;
				// res = getResponse(action.response);

				// if ( res.response === null ) {
				// 	res.response = {};
				// 	res.response.dataList = [];
				// 	res.response.total = 0;
				// }

				// state.channel = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {channel: action.response.response} );

			case SearchActionType.SEARCH_BY_TAG:
				if (action.response === null || !action.response.response) return state;
				// res = getResponse(action.response);

				// if ( res.response === null ) {
				// 	res.response = {};
				// 	res.response.activityList = [];
				// 	res.response.stickey = "";
				// 	res.response.oriQuery = "";
				// 	res.response.nextPage = false;
				// 	res.response.totalHits = 0;
				// }

				// state.activity = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {activity: action.response.response} );

			case SearchActionType.SEARCH_BY_KEYWORD:
				if (action.response === null || !action.response.response) return state;
				// res = getResponse(action.response);
// action.response = {};
// action.response.response = null;
// 				if ( action.response.response === null ) {
// 					action.response.response = {};
// 					action.response.response.activityList = [];
// 					action.response.response.stickey = "";
// 					action.response.response.oriQuery = "";
// 					action.response.response.nextPage = false;
// 					action.response.response.totalHits = 0;
// 				}

				// state.activity = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {activity: action.response.response} );

			case SearchActionType.SEARCH_BY_KEYWORD_AT_PUBLIC_CHANNEL:
				if (action.response === null || !action.response.response) return state;
				// res = getResponse(action.response);

				// if ( res.response === null ) {
				// 	res.response = {};
				// 	res.response.activityList = [];
				// 	res.response.stickey = "";
				// 	res.response.oriQuery = "";
				// 	res.response.nextPage = false;
				// 	res.response.totalHits = 0;
				// }

				// state.activity = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {activity: action.response.response} );

			case SearchActionType.SEARCH_BY_KEYWORD_AT_PRIVAYE_CHANNEL:
				if (action.response === null || !action.response.response) return state;
				// res = getResponse(action.response);

				// if ( res.response === null ) {
				// 	res.response = {};
				// 	res.response.activityList = [];
				// 	res.response.stickey = "";
				// 	res.response.oriQuery = "";
				// 	res.response.nextPage = false;
				// 	res.response.totalHits = 0;
				// }

				// state.activity = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {activity: action.response.response} );

			case SearchActionType.SEARCH_BY_KEYWORD_AT_AUTHOR:
				if (action.response === null || !action.response.response) return state;
				// res = getResponse(action.response);

				// if ( res.response === null ) {
				// 	res.response = {};
				// 	res.response.activityList = [];
				// 	res.response.stickey = "";
				// 	res.response.oriQuery = "";
				// 	res.response.nextPage = false;
				// 	res.response.totalHits = 0;
				// }

				// state.activity = res.response;
				// if (res.warning) {
				// 	state.warning = res.warning;
				// }
				return Object.assign({}, state, {activity: action.response.response} );
			case SearchActionType.SUBSCRIBE_SEARCHED_MEDIA:
				state.channel.dataList[action.index].subscribe = true;
				return Object.assign({}, state);
			default:
				return state;
		}


	}catch(e){
		console.log(e)
		return state;
	}
};
