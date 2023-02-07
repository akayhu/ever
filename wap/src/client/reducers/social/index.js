import * as SocialActionType from '../../actions/social';

export const initState = {
	colleague: {
		colleagueList: [],
		listSize: 0,
		lastTimeInMillis: 0,
		visitorInList: false,
		colleagueWishStatus: false
	},
	appraise: {
		appraiseList: [],
		listSize: 0,
		lastTimeInMillis: 0,
		visitorInList: false
	},
	appraiseNotSort: {
		appraiseList: [],
		listSize: 0,
		lastTimeInMillis: 0,
		visitorInList: false
	},
	pending: {
		appraiseList: [],
		listSize: 0,
		lastTimeInMillis: 0,
		visitorInList: false
	},
};

export default function socialReducer(state = initState, action){
	try{
		let appraise = null;
		let pending = null;

		switch(action.type){
			case SocialActionType.QUERY_COLLEAGE_LIST:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				var { colleagueList, listSize, lastTimeInMillis, visitorInList } = action.response.response;
				var colleague = {
					colleagueList,
					listSize,
					lastTimeInMillis,
					visitorInList,
					colleagueWishStatus: state.colleague.colleagueWishStatus
				};
				return Object.assign({}, state, { colleague });

			case SocialActionType.QUERY_COLLEAGUE_WISH_STATUS:
				if (action.response === null || !action.response.response) return state;
				var newColleague = Object.assign({}, state.colleague, { colleagueWishStatus: action.response.response });
				return Object.assign({}, state, { colleague: newColleague });

			case SocialActionType.ADD_COLLEAGUE_WISH:
				if (action.response === null || !action.response.response) return state;
				var { colleagueList, listSize, lastTimeInMillis, visitorInList } = state.colleague;
				state.colleague.colleagueList.push(action.response.response);
				var newColleague = Object.assign({}, state.colleague, {
					listSize: state.colleague.listSize + 1,
					colleagueWishStatus: true
				});
				return Object.assign({}, state, { colleague: newColleague });

			case SocialActionType.REMOVE_COLLEAGUE:
				const newColleagueList = state.colleague.colleagueList.filter((item) => { if(item.pid !== action.pid) return item });
				var newColleague = Object.assign({}, state.colleague, {
					colleagueList: newColleagueList,
					listSize: newColleagueList.length,
					colleagueWishStatus: false
				});
				return Object.assign({}, state, { colleague: newColleague });
			case SocialActionType.QUERY_APPRAISE_LIST_OF_OWNER:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				appraise = Object.assign({}, state.appraise, {
					appraiseList: action.response.response.appraiseList ? state.appraise.appraiseList.concat(action.response.response.appraiseList):state.appraise.appraiseList,
					listSize: action.response.response.listSize || 0,
					lastTimeInMillis: action.response.response.lastTimeInMillis || 0,
					visitorInList: action.response.response.visitorInList || false
				});
				return Object.assign({}, state, { appraise });

			case SocialActionType.QUERY_APPRAISE_LIST:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				appraise = Object.assign({}, state.appraise, {
					appraiseList: state.appraise.appraiseList.concat(action.response.response.appraiseList),
					listSize: action.response.response.listSize,
					lastTimeInMillis: action.response.response.lastTimeInMillis,
					visitorInList: action.response.response.visitorInList
				});
				return Object.assign( {}, state, { appraise } );

			case SocialActionType.QUERY_APPRAISE_LIST_NOT_SORT:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				let appraiseNotSort = Object.assign({}, state.appraiseNotSort, {
					appraiseList: state.appraiseNotSort.appraiseList.concat(action.response.response.appraiseList),
					listSize: action.response.response.listSize,
					lastTimeInMillis: action.response.response.lastTimeInMillis,
					visitorInList: action.response.response.visitorInList
				});
				return Object.assign( {}, state, { appraiseNotSort } );

			case SocialActionType.QUERY_APPRAISE_PENDING_LIST:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				pending = Object.assign({}, state.pending, {
					appraiseList: state.pending.appraiseList.concat(action.response.response.appraiseList),
					listSize: action.response.response.listSize,
					lastTimeInMillis: action.response.response.lastTimeInMillis,
					visitorInList: action.response.response.visitorInList
				});
				return Object.assign( {}, state, { pending } );

			case SocialActionType.ADD_APPRAISE_TEXT:
				if (action.response.hasOwnProperty('error')) {
					return state
				};
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				return Object.assign( {}, state, {
					appraise: {
						visitorInList: true,
						listSize: state.appraise.listSize,
						appraiseList: [].concat(action.response.response).concat(state.appraise.appraiseList),
						lastTimeInMillis: state.appraise.lastTimeInMillis
					}
				});

			case SocialActionType.DELETE_APPRAISE_TEXT:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				appraise = Object.assign({}, state.appraise, {
					appraiseList: state.appraise.appraiseList.filter(item => {
						return item.pid !== action.response.response.pid
					}),
					listSize: state.appraise.listSize - 1
				});
				return Object.assign({}, state, {appraise});

			case SocialActionType.DELETE_PENDDING_APPRAISE:
				pending = Object.assign({}, state.pending, {
					appraiseList: state.pending.appraiseList.filter(item => {
						return item.pid !== action.params.pid
					}),
					listSize: state.pending.listSize - 1
				});
				return Object.assign({}, state, {pending});

			case SocialActionType.MODIFY_PUBLISH_APPRAISE_TEXT:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				appraise = Object.assign({}, state.appraise, {
					appraiseList: state.appraise.appraiseList.map(item => {
						if( item.pid === action.response.response.pid) {
							return Object.assign({}, item, {
								privateSetting: action.response.response.privateSetting
							});
						}
						return item
					})
				});
				pending = Object.assign({}, state.pending, {
					appraiseList: state.pending.appraiseList.filter(item => {
						return item.pid !== action.response.response.pid
					}),
					listSize: state.pending.listSize - 1
				});
				return Object.assign({}, state, {pending, appraise});

			case SocialActionType.PUBLISH_APPRAISE_TEXT:
				if (action.response === null || !action.response.response) return state;
				if (Object.keys(action.response).length === 0 ) return state;
				appraise = Object.assign({}, state.appraise, {
					appraiseList: state.appraise.appraiseList.map(item => {
						if( item.pid === action.response.response.pid) {
							return Object.assign({}, item, {
								privateSetting: action.response.response.privateSetting
							});
						}
						return item
					})
				});
				return Object.assign({}, state, {appraise});

			case SocialActionType.CLEAR_APPRAISE:
				return Object.assign({}, state, {
					appraise: {
						appraiseList: [],
						listSize: 0,
						lastTimeInMillis: 0,
						visitorInList: false
					},
					appraiseNotSort: {
						appraiseList: [],
						listSize: 0,
						lastTimeInMillis: 0,
						visitorInList: false
					},
					pending: {
						appraiseList: [],
						listSize: 0,
						lastTimeInMillis: 0,
						visitorInList: false
					}
				});

			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};
