import * as EndorseActionType from '../actions/endorse';

export const initState = {
	endorseList: {
		dataList: [],
		total: 0,
		hasNext: false
	},
	endorseUserList: {},
	endorseSortList: {}
};

export default function endorseReducer(state = initState, action){
	try{
		let res = action.response;
		let item = null;
		let dataList = null;
		let hasNext = null;
		let offset = null;
		let total = null;
		let endorseList = {};
		let originList = [];
		let newDataList = [];
		
		switch(action.type){
			case EndorseActionType.GET_ENDORSE_LIST:
				if(res instanceof Array) {
					res = res[0];
				}
				if (!res) return state;
				if ('warning' in res) { //warning handle
					return state;
				}
				if ('error' in res) {
					return state;
				}
				dataList = res.response.dataList;
				hasNext = res.response.hasNext;
				offset = res.response.offset;
				total = res.response.total;
				endorseList = Object.assign({}, state.endorseList, {
					hasNext,
					offset,
					total,
					dataList
				});
				return Object.assign({}, state, {endorseList} );

			case EndorseActionType.GET_ENDORSE_LIST_CONCAT:
				if(res instanceof Array) {
					res = res[0];
				}
				if (!res) return state;
				if ('warning' in res) { //warning handle
					return state;
				}
				if ('error' in res) {
					return state;
				}
				dataList = res.response.dataList;
				hasNext = res.response.hasNext;
				offset = res.response.offset;
				total = res.response.total;
				originList = [...state.endorseList.dataList];
				// 顯示更多 與原本的十筆做合併
				endorseList = Object.assign({}, state.endorseList, {
					hasNext,
					offset,
					total,
					dataList: originList.concat(dataList)
				})
				return Object.assign({}, state, {endorseList} );

			case EndorseActionType.GET_ENDORSE_SORT_LIST:
				return Object.assign({}, state, {endorseSortList: action.response});

			case EndorseActionType.UPDATE_ENDORSE_DESC:
				if (action.response === null || !action.response.response) return state;
				dataList = state.endorseList.dataList.map(data => {
					if (data.item === action.response.response.item) {
						return Object.assign({}, data, {desc: action.response.response.desc});
					}
					return data;
				});
				endorseList = Object.assign({}, state.endorseList, {dataList: dataList});
				return Object.assign({}, state, {endorseList: endorseList});

			case EndorseActionType.DELETE_ENDORSE:
				return state;

			case EndorseActionType.DELETE_ENDORSE_IN_STATE:
				dataList = state.endorseList.dataList.filter(data => {
					return data.item !== action.params.item
				})
				endorseList = Object.assign({}, state.endorseList, {dataList: dataList});
				return Object.assign({}, state, {endorseList: endorseList});

			case EndorseActionType.REMOVE_ENDORSE_FOR_USER:
				return state;

			case EndorseActionType.REMOVE_ENDORSE_FOR_USER_IN_STATE:
				newDataList = state.endorseList.dataList.map(data => {
					if (data.item === action.params.item) {
						return Object.assign({}, data, {
							srcUserInfo: data.srcUserInfo.filter(user => {
								return user.pid !== action.params.pid
							}),
							count: data.count - 1,
							endorsed: false
						});
					}
					return data;
				});

				endorseList = Object.assign({}, state.endorseList, {dataList: newDataList});
				let endorseUserList;
				const isExist = !!state.endorseUserList[action.params.item]
				if (isExist) {
					let newUserListData = Object.assign({}, state.endorseUserList[action.params.item], {
						dataList: state.endorseUserList[action.params.item].dataList.filter(data => data.pid !== action.params.pid),
						total: state.endorseUserList[action.params.item].total - 1,
						offset:  state.endorseUserList[action.params.item].offset - 1
					})

				 	endorseUserList = Object.assign({}, state.endorseUserList, {
						[action.params.item]: newUserListData
					})
				}

				return Object.assign({}, state, {
					endorseList: endorseList,
					endorseUserList: isExist ? endorseUserList : state.endorseUserList
				});

			case EndorseActionType.CREATE_ENDORSE:
				if (action.response === null || !action.response.response) return state;
				endorseList = Object.assign({}, state.endorseList, {
					dataList: state.endorseList.dataList.concat(Object.assign({}, action.response.response, {
						srcUserInfo: action.response.response.srcUserInfo || []
					})),
					total: state.endorseList.total + 1
				});
				return Object.assign({}, state, {endorseList: endorseList});

			case EndorseActionType.ADD_ENDORSE_FOR_USER:
				return state

			case EndorseActionType.ADD_ENDORSE_FOR_USER_IN_STATE:
				newDataList = state.endorseList.dataList.map(data => {
					if (data.item === action.params.item) {
						return Object.assign({}, data, {
							count: data.count + 1,
							endorsed: true
						});
					}
					return data;
				})
				let endorseList = Object.assign({}, state.endorseList, {dataList: newDataList});

				return Object.assign({}, state, {
					endorseList: endorseList
				})

			case EndorseActionType.INIT_ENDORSE_USER_LIST: {
				item = action.data.item;
				dataList = action.data.dataList;
				hasNext = action.data.hasNext;
				offset = action.data.offset;
				total = action.data.total;
				
				originList = state.endorseUserList[item] ?
					state.endorseUserList[item].dataList :
					[]
				endorseUserList = Object.assign({}, state.endorseUserList, {
					[item]: {
						hasNext: hasNext,
						offset: offset,
						total: total,
						dataList: originList.concat(dataList)
					}
				});
				return Object.assign({}, state, { endorseUserList })
			}
			case EndorseActionType.GET_ENDORSE_USER_LIST:
				return state

			case EndorseActionType.UPDATE_ENDORSE_SORT_LIST:
				if (action.response === null) return state;
				return Object.assign({}, state);

			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};
