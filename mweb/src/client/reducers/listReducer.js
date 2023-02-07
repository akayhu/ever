import {
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	RESET_LIST
} from 'src/client/actions/general';
import {combineReducers} from 'redux';
import {isActionForReducer} from 'src/util/checkTools';

/*
{
	dataList: [],
	error: false,
	loading: false,
	offset: '',
	end: false,
	hasLoaded: false,
	total: 0
}
*/

const createList = ({domain, key}) => {
	const dataList = (state = [], action) => {
		if (!isActionForReducer({domain, key, action})) {
			return state;
		}
		switch (action.type) {
			case RECEIVE_DATA:
				return [...state, ...action.payload.dataList];
			case RESET_LIST:
				return [];
			default:
				return state;
		}
	};
	const error = (state = false, action) => {
		if (!isActionForReducer({domain, key, action})) {
			return state;
		}
		switch (action.type) {
			case RECEIVE_FAIL:
				return true;
			case REQUEST_DATA:
			case RECEIVE_DATA:
				return false;
			case RESET_LIST:
				return false;
			default:
				return state;
		}
	};
	const loading = (state = false, action) => {
		if (!isActionForReducer({domain, key, action})) {
			return state;
		}
		switch (action.type) {
			case REQUEST_DATA:
				return true;
			case RECEIVE_FAIL:
			case RECEIVE_DATA:
				return false;
			case RESET_LIST:
				return false;
			default:
				return state;
		}
	};
	const offset = (state = 0, action) => {
		if (!isActionForReducer({domain, key, action})) {
			return state;
		}
		switch (action.type) {
			case RECEIVE_DATA:
				if(!action.payload.offset){
					return state;
				}
				
				return action.payload.offset;
			case RESET_LIST:
				return 0;
			default:
				return state;
		}
	}
	const hasLoaded = (state = false, action) => {
		if (!isActionForReducer({domain, key, action})) {
			return state;
		}
		switch (action.type) {
			case RECEIVE_DATA:
				return true;
			case RESET_LIST:
				return false;
			default:
				return state;
		}
	}
	const end = (state = false, action) => {
		if (!isActionForReducer({domain, key, action})) {
			return state;
		}
		switch (action.type) {
			case REACH_END:
				return true;
			case RESET_LIST:
				return false;
			default:
				return state;
		}
	};
	const total = (state = 0, action) => {
		if (!isActionForReducer({domain, key, action})) {
			return state;
		}
		
		switch (action.type) {
			case RECEIVE_DATA:
				if(domain === 'search'){
					switch(key){
						case "activity":
							return action.payload.offset.totalHits;
						case "person":
							return action.payload.total;
						default:
							return state;
					}
				}else{
					if(action.payload.total){
						return action.payload.total;
					}else{
						return state;
					}
				}
			case RESET_LIST:
				return 0;
			default:
				return state;
		}
	};

	return combineReducers({
		dataList,
		error,
		loading,
		offset,
		hasLoaded,
		end,
		total
	});
};

export default createList;
