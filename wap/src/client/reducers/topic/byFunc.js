import {
	REQUEST_DATA,
	GET_DATA,
	SET_SHOULDRESET,
	SET_ISEND,
	SET_ISERROR,
	CHANGE_FUNC,
	INIT_TOPIC_PAGE
} from '../../actions/topic';
import {baseData, funcModel} from './models';

// for update baseData
function valueReducer(state = baseData, action) {
	try {	
		switch (action.type) {
			case REQUEST_DATA: {
				return {...state,
					isLoading: true,
					isError: false
				};
			}
			case GET_DATA: {
				const {ids, info} = action.payload;
				// 當載入initialEndorse時候，info才會有資料
				return {...state,
					ids: state.ids.concat(ids),
					offset: state.offset + ids.length,
					isLoading: false,
					isError: false,
					...info
				};
			}
			case SET_SHOULDRESET: {
				const {shouldReset} = action.payload;
				return {...state, shouldReset};
			}
			case SET_ISEND: {
				const {isEnd} = action.payload;
				return {...state,
					isEnd,
					isLoading: false
				};
			}
			case SET_ISERROR: {
				const {isError} = action.payload;
				return {...state, isError};
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}

// for update funcModel
function pairReducer(state = funcModel, action) {
	try {	
		switch (action.type) {
			case REQUEST_DATA:
			case GET_DATA:
			case SET_SHOULDRESET:
			case SET_ISEND:
			case SET_ISERROR: {
				const {key, subkey} = action.payload;
				if (subkey) {
					return {...state,
						[key]: {...state[key],
							[subkey]: {...valueReducer(state[key][subkey], action), title: subkey}
						}
					};
				}
				return {...state,
					[key]: valueReducer(state[key], action)
				};
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
/**
for update byFnc store
{func: funcModel, func2: funcModel...}
*/
export default function funcReducer(state = {}, action) {
	try {	
		switch (action.type) {
			case REQUEST_DATA:
			case GET_DATA:
			case SET_SHOULDRESET:
			case SET_ISEND:
			case SET_ISERROR: {
				const {func, key} = action.payload;
				if (['initialEndorse', 'initialRelated', 'initialHonor'].indexOf(key) !== -1) {
					return state;
				}
				return {...state,
					[func]: pairReducer(state[func], action)
				};
			}
			case INIT_TOPIC_PAGE: {
				const {func} = action.payload;
				const loadedFunc = Object.keys(state);

				if (loadedFunc.indexOf(func) === -1) {
					return {...state,
						[func]: funcModel
					};
				}
				return state;
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
}
