import * as ChannelActionType from '../../actions/channel';
import { combineReducers } from 'redux';

export const initListState = tab =>
	combineReducers({
		dataList: dataList(tab),
		hasNext: hasNext(tab),
		offset: offset(tab),
		total: total(tab),
		loading: loading(tab),
		waitForReset: waitForReset(tab)
	});

const dataListPreprocess = (tab, response) => {
	try {
		switch (tab) {
			case 'channelActivity':
				return response.activityList.map(activity => ({...activity, ignore: false}));
			default:
				return response.dataList || [];
		}
	} catch (e) {
		console.log(e);
		const res = response.dataList || [];
		return res;
	}
};

export function dataList(tab) {
	return function dataListReducer(state = [], action) {
		try {
			if (tab !== action.tab) {
				return state;
			}
			switch (action.type) {
				case ChannelActionType.RECEIVE_DATA: {
					const data = dataListPreprocess(tab, action.response);
					return action.response ? [...state, ...data]
																	: state;
					// return action.response.dataList ? [...state, ...action.response.dataList]
					// 																: state;
				}
				case ChannelActionType.CLEAR_DATA:
					return [];
				case ChannelActionType.ON_ADD_MEDIA_ROLE: {
					const { targetPid, role } = action;
					return state.map((item) => {
						if (item.pid === targetPid) {
							return {...item, role};
						}
						return item;
					});
				}
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

export function hasNext(tab) {
	return function hasNextReducer(state = true, action) {
		try {
			if (tab !== action.tab) {
				return state;
			}
			switch (action.type) {
				case ChannelActionType.RECEIVE_DATA:
					if (action.response.hasOwnProperty('hasNext')) {
						return !!action.response.hasNext;
					} else if (action.response.hasOwnProperty('nextFrom')) {
						return !!action.response.nextFrom;
					}
					return false;


				case ChannelActionType.CLEAR_DATA:
					return false;
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

export function offset(tab) {
	return function offsetReducer(state = 0, action) {
		try {
			if (tab !== action.tab) {
				return state;
			}
			switch (action.type) {
				case ChannelActionType.RECEIVE_DATA:
					return action.response.offset;
				case ChannelActionType.CLEAR_DATA:
					return 0;
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

export function total(tab) {
	return function totalReducer(state = 0, action) {
		try {
			if (tab !== action.tab) {
				return state;
			}
			switch (action.type) {
				case ChannelActionType.RECEIVE_DATA:
					if (action.response.hasOwnProperty('total')) {
						return action.response.total;
					}
					return action.response.activityList.length;

					return action.response.total;
				case ChannelActionType.COUNT_TOTAL:
					return action.total + action.count;
				case ChannelActionType.CLEAR_DATA:
					return 0;
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

export function loading(tab) {
	return function loadingReducer(state = false, action) {
		try {
			if (tab !== action.tab) {
				return state;
			}
			switch (action.type) {
				case ChannelActionType.RECEIVE_DATA:
					return false;
				case ChannelActionType.REQUEST_DATA:
					return true;
				case ChannelActionType.CLEAR_DATA:
					return false;
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

export function waitForReset(tab) {
	return function waitForResetReducer(state = false, action) {
		try {
			switch (action.type) {
				// 按下關注or取消關注後 當前tab不reload，其餘兩個需要重新reload
				case ChannelActionType.ADD_WAIT_FOR_RESET: {
					if (tab === action.tab) {
						return state;
					}
					return true;
				}
				case ChannelActionType.CLEAR_DATA: {
					// 確定要重新load的時候false等待重置
					if (tab !== action.tab) {
						return state;
					}
					return false;
				}
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}

export function dataInfo(tab) {
	return function dataInfoReducer(state = { subscriberList: [] }, action) {
		try {
			if (tab !== action.tab) {
				return state;
			}
			switch (action.type) {
				case ChannelActionType.UPDATE_MEDIA_INFO:
				case ChannelActionType.RECEIVE_DATA:
					return action.response;
				case ChannelActionType.CLEAR_DATA:
					return { subscriberList: [] };
				default:
					return state;
			}
		} catch (e) {
			console.log(e);
			return state;
		}
	};
}
