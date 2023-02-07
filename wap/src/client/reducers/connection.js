import * as ConnectionActionType from '../actions/connection';
import errorHandle from '../../util/errorHandle';

const initListState = {
	dataList: [],
	total: 0,
	error: false,
	loading: false,
	end: false,
	count: 0
};

export const initState = {
	active: 'friend',
	friend: initListState,
	invitations: initListState,
	unconfirmed: initListState,
	groupFriend: {
		0: initListState,
	},
	following: initListState,
	myfollowers: initListState,
	othersfollowers: {
		0: initListState
	},
	mayKnowPeopleList: initListState,
	nonSelf: initListState,
	groupItems: initListState,
	mutualFriends: {
		0: initListState,
	},
	excellentPeopleList: Object.assign({}, initListState, {
		peopleCount: 0,
		mediaCount: 0
	}),
	connection_status: {
		connectionStatus: 0,
		subscribeStatus: false,
		notificationStatus: false
	},
	attention: [],
	exclude: {},
	exclude_list: [],
	block: {},
	blockListItem: initListState
};

export default function connectionReducer(state = initState, action) {
	// 很不懂的 在@@redux/INIT時 state.blockListItem.loading會被改成true，找不到原因只好強制在這邊重新改成initState
	// 這個不要拔掉 leon在觀察在staging的狀況
	if (action.type === '@@redux/INIT') state = initState;
	try {
		const {category, response, otherParams, active} = action;
		let type = null;
		let res = null;

		switch (action.type) {
			case ConnectionActionType.CHANGE_ACTIVE: {
				return Object.assign({}, state, {
					active: action.active
				});
			}
			case ConnectionActionType.REQUEST_DATA: {
				type = isNumber(category) ? 'groupFriend' : category;
				switch (type) {
					case 'groupItems':
					case 'friend':
					case 'invitations':
					case 'unconfirmed':
					case 'following':
					case 'myfollowers':
					case 'mayKnowPeopleList':
					case 'nonSelf':
					case 'excellentPeopleList':
					case 'blockListItem': {
						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								loading: true
							})
						});
					}
					case 'othersfollowers':
					case 'mutualFriends': {
						const originState = state[type][otherParams.targetPid] || initListState;

						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								[otherParams.targetPid]: Object.assign({}, originState, {
									loading: true,
								})
							})
						});
					}
					case 'groupFriend': {
						return Object.assign({}, state, {
							groupFriend: Object.assign({}, state.groupFriend, {
								[category]: Object.assign({}, state.groupFriend[category], {
									loading: true,
								})
							})
						});
					}
					default: {
						return state;
					}
				}
			}
			case ConnectionActionType.RECEIVE_DATA: {
				type = isNumber(category) ? 'groupFriend' : category;
				switch (type) {
					case 'groupItems': {
						const { total, dataList } = response;
						// init groupFriend
						const groupFriend = response.reduce((groupFriend, cur) => {
							groupFriend[cur.groupId] = initListState;
							return groupFriend;
						}, {});

						return Object.assign({}, state, {
							groupFriend,
							[type]: Object.assign({}, state[type], {
								dataList: response,
								error: false,
								loading: false,
								count:　response.length
							})
						});
					}
					case 'friend':
					case 'invitations':
					case 'unconfirmed':
					case 'following':
					case 'myfollowers':
					case 'mayKnowPeopleList':
					case 'nonSelf':
					case 'blockListItem': {
						const originList = state[type].dataList || [];
						let total;
						let	dataList;
						let	keyList;

						if (response.hasOwnProperty('total')) {
								total = response.total;
								dataList = response.dataList;
							} else {
								keyList = Object.keys(response);
								total = keyList.length;
								dataList = keyList.reduce((newObj, item, index) => {
									newObj.push(response[item]);
									return newObj;
								}, []);
							}

						return Object.assign({}, state, {
								[type]: Object.assign({}, state[type], {
									total,
									dataList: [...originList, ...dataList],
									error: false,
									loading: false,
									count: state[type].count + dataList.length
								})
							});
					}
					case 'othersfollowers':
					case 'mutualFriends': {
						const originList = state[type][otherParams.targetPid] ? state[type][otherParams.targetPid].dataList : [];
						const { total, dataList } = response;
						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								[otherParams.targetPid]: Object.assign({}, state[type][otherParams.targetPid], {
									total,
									dataList: [...originList, ...dataList],
									error: false,
									loading: false,
									count: state[type][otherParams.targetPid] ? state[type][otherParams.targetPid].count + dataList.length : dataList.length
								})
							})
						});
					}
					case 'excellentPeopleList': {
						const {dataList: {mediaList, peopleList}, peopleTotal, mediaTotal, mediaOffset, peopleOffset} = response;
						const originList = state[type].dataList || [];

						for (let i = 0; i < (mediaList.length > peopleList.length ? mediaList.length : peopleList.length); i++) {
							if (mediaList[i]) mediaList[i].type = 'media';
							if (peopleList[i]) peopleList[i].type = 'people';
						}

						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								total: peopleTotal + mediaTotal,
								dataList: [...originList, ...mediaList, ...peopleList],
								error: false,
								loading: false,
								count: peopleOffset + mediaOffset,
								peopleCount: peopleOffset,
								mediaCount: mediaOffset
							})
						});
					}
					case 'groupFriend': {
						const { total, dataList } = response;
						const originList = state.groupFriend[category].dataList || [];

						return Object.assign({}, state, {
							groupFriend: Object.assign({}, state.groupFriend, {
								[category]: Object.assign({}, state.groupFriend[category], {
									total,
									dataList: [...originList, ...dataList],
									error: false,
									loading: false,
									count: state.groupFriend[category].count + dataList.length
								})
							})
						});
					}
					default:
						return state;
				}
			}
			case ConnectionActionType.RECEIVE_FAIL: {
				type = isNumber(category) ? 'groupFriend' : category;
				switch (type) {
					case 'groupItems':
					case 'friend':
					case 'invitations':
					case 'unconfirmed':
					case 'following':
					case 'myfollowers':
					case 'mayKnowPeopleList':
					case 'excellentPeopleList':
					case 'nonSelf':
					case 'blockListItem':
						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								error: true,
								loading: false
							})
						});
					case 'othersfollowers':
					case 'mutualFriends':
						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								[otherParams.targetPid]: Object.assign({}, state[type][otherParams.targetPid], {
									error: true,
									loading: false,
								})
							})
						});
					case 'groupFriend':
						return Object.assign({}, state, {
							groupFriend: Object.assign({}, state.groupFriend, {
								[category]: Object.assign({}, state.groupFriend[category], {
									error: true,
									loading: false,
								})
							})
						});
					default:
						return state;
				}
			}
			case ConnectionActionType.REACH_END: {
				type = isNumber(category) ? 'groupFriend' : category;
				switch (type) {
					case 'groupItems':
					case 'friend':
					case 'invitations':
					case 'unconfirmed':
					case 'following':
					case 'myfollowers':
					case 'mayKnowPeopleList':
					case 'excellentPeopleList':
					case 'nonSelf':
					case 'blockListItem':
						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								end: true
							})
						});
					case 'othersfollowers':
					case 'mutualFriends':
						return Object.assign({}, state, {
							[type]: Object.assign({}, state[type], {
								[otherParams.targetPid]: Object.assign({}, state[type][otherParams.targetPid], {
									end: true
								})
							})
						});
					case 'groupFriend':
						return Object.assign({}, state, {
							groupFriend: Object.assign({}, state.groupFriend, {
								[category]: Object.assign({}, state.groupFriend[category], {
									end: true
								})
							})
						});
					default:
						return state;
				}
			}
			case ConnectionActionType.CLEAR: {
				return Object.assign({}, state, {
					following: initListState
				});
			}
			case ConnectionActionType.CLEAR_ALL: {
				return Object.assign({}, state, initState);
			}
			case ConnectionActionType.GET_CONNECTION_STATUS: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}
				// res = res.response[Object.keys(res.response)[0]]

				return Object.assign({}, state, {connection_status: res});
			}
			case ConnectionActionType.SUBSCRIBE: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}
				if (errorHandle(res)) return state;

				var targetPid = res.status.targetPid;
				state.connection_status[targetPid] = res.status;
				return Object.assign({}, state);
			}
			case ConnectionActionType.UNSUBSCRIBE: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}

				if (errorHandle(res)) return state;

				var targetPid = res.status.targetPid;
				state.connection_status[targetPid] = res.status;
				return Object.assign({}, state);
			}
			case ConnectionActionType.NOTICE: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}

				if (errorHandle(res)) return state;

				var targetPid = res.status.targetPid;
				state.connection_status[targetPid] = res.status;
				return Object.assign({}, state);
			}
			case ConnectionActionType.DISCONNECT: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}

				if (errorHandle(res)) return state;
				const newFriend = state.friend.dataList.filter(item => item.pid !== res.status.targetPid);
				const mutualFriends = Object.assign({}, state.mutualFriends);
				delete mutualFriends[res.status.targetPid];

				const friend = Object.assign({}, state.friend, {
					total: state.friend.total - 1,
					dataList: newFriend
				});

				return Object.assign({}, state, {friend, mutualFriends});
			}
			case ConnectionActionType.LOADED_MY_FOLLOW_LIMIT: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}

				if (typeof res === 'string') {
					res = {
						total: 0,
						dataList: []
					};
				}

				res = res.dataList || res;

				return Object.assign({}, state, {attention: res});
			}
			case ConnectionActionType.BLOCK: {
				if (action.response === null) return state;

				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}
				if (errorHandle(res)) return state;
				const status = res.status;
				if (status.connectionStatus === 4) { // connectionStatus 4, block
					state.blockListItem = initListState;
				}
				if (status.connectionStatus === 0) { // connectionStatus 0, unblock
					state.blockListItem = initListState;
				}
				// res = res.response[Object.keys(res.response)[0]]

				return Object.assign({}, state, {block: res});
			}
			// case ConnectionActionType.GET_BLOCK_LIST: {
			// 	if (action.response === null) return state;
			// 	if (Object.keys(action.response).length === 0) return state;
			// 	res = null;
			// 	if(typeof action.response !== 'undefined' ) {
			// 		res = action.response.response || action.response;
			// 	}
			//
			// 	const {offset, total, hasNext, dataList} = res;
			// 	const blockListItem = {offset, total, hasNext, dataList}
			//
			// 	return Object.assign({}, state, { blockListItem });
			// }
			case ConnectionActionType.EXCLUDE: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}
				// res = res.response[Object.keys(res.response)[0]]

				return Object.assign({}, state, {exclude: res});
			}
			case ConnectionActionType.GET_EXCLUDE_LIST: {
				if (action.response === null) return state;
				if (Object.keys(action.response).length === 0) return state;
				res = null;
				if (typeof action.response !== 'undefined') {
					res = action.response.response || action.response;
				}
				// res = res.response[Object.keys(res.response)[0]]

				return Object.assign({}, state, {exclude_list: res});
			}
			default: {
				return state;
			}
		}
	} catch(e) {
		console.log(e);
		return state;
	}
}


// util
const isNumber = category => Number.isInteger(+category);

// selector
const getBlockIds = state => state.blockListItem.dataList.map(item => item.pid);

export const getActive = state => state.active;
export const getIsLoading = (state, category, otherParams) => {
	if (isNumber(category)) return state.groupFriend[category].loading;
	if (category === 'mutualFriends' || category === 'othersfollowers') {
		return state[category][otherParams.targetPid]
			? state[category][otherParams.targetPid].loading
			: false;
	}
	return state[category].loading;
};
export const getCurrentCount = (state, category, otherParams) => {
	if (isNumber(category)) return state.groupFriend[category].count;
	if (category === 'mutualFriends' || category === 'othersfollowers') {
		return state[category][otherParams.targetPid]
			? state[category][otherParams.targetPid].count
			: 0;
	}
	return state[category].count;
};
export const getDataList = (state, category, otherParams) => {
	if (isNumber(category)) return state.groupFriend[category].dataList;
	if (category === 'mutualFriends' || category === 'othersfollowers') {
		return state[category][otherParams.targetPid]
			? state[category][otherParams.targetPid].dataList
			: [];
	}
	const blockIds = getBlockIds(state);
	return state[category].dataList.filter(data => !blockIds.includes(data.pid));
};
export const getIsError = (state, category, otherParams) => {
	if (isNumber(category)) return state.groupFriend[category].error;
	if (category === 'mutualFriends' || category === 'othersfollowers') {
		return state[category][otherParams.targetPid]
			? state[category][otherParams.targetPid].error
			: false;
	}
	return state[category].error;
};
export const getIsEnd = (state, category, otherParams) => {
	if (isNumber(category)) return state.groupFriend[category].end;
	if (category === 'mutualFriends' || category === 'othersfollowers') {
		return state[category][otherParams.targetPid]
			? state[category][otherParams.targetPid].end
			: false;
	}
	return state[category].end;
};
export const getTotal = (state, category, otherParams) => {
	if (isNumber(category)) return state.groupFriend[category].total;
	if (category === 'mutualFriends' || category === 'othersfollowers') {
		return state[category][otherParams.targetPid]
			? state[category][otherParams.targetPid].total
			: 0;
	}
	return state[category].total;
};
export const getExcellentPeopleListParams = state => ({
	peopleCount: state.excellentPeopleList.peopleCount,
	mediaCount: state.excellentPeopleList.mediaCount,
});
