import { combineReducers } from 'redux';
import { default as responseModel} from './modelMap';
import {
	RECEIVE_DATA,
	RECEIVE_FAIL,
	REQUEST_DATA,
	REACH_END,
	DELETE_ACTIVITY_SUCCESS,
	CHECK_APPLICANT,
	CHECK_ALL_APPLICANTS,
	VERIFYING_MEMBERS,
	VERIFY_MEMBER_SUCCESS,
	VERIFY_MEMBER_ERROR,
	CHANGE_MEMBER_RULE,
	ON_DELETE_GROUP_MEMBER,
	CLEAR_DATA,
	UPDATE_GROUP_INFO,
} from '../../../actions/group';
import {
	REVOKE,
	INVITE,
	ACCEPT,
	REJECT,
} from '../../../actions/connection';

const handleActionCategories = [
	'joined', 'waitForJoin', 'managed', 'checking', 'rejected',
	'knowAndTech', 'lifestyle', 'healthAndLeisure', 'artAndDesign'
]

const dataListPreprocess = (category, response) => {
	try{
		switch (category) {
			case 'groupActivity':
				return response.activityList.map(activity => ({...activity, ignore: false}));
			case 'applyList':
				return response.dataList.map(item => ({
					...item,
					checked: false,
					loading: false,
					error: false
				}));
			case 'groupActivityForCheck':
				return response.activityList.map(item => ({
					...item,
					checked: false,
					loading: false,
					error: false
				}));
			default:
				if (handleActionCategories.indexOf(category) !== -1) {
					return response.dataList.map(data => data.id) || [];
				}
				return response.dataList || [];
		}
	} catch (e) {
		console.log(e)
		let res = response.dataList || []
		return res;
	}
};

export function dataList(category) {
	const styleOfResponse = responseModel[category];
	return function dataListReducer(state = [], action) {
		try{
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case RECEIVE_DATA: {
					const data = dataListPreprocess(category, action.response);
					return (styleOfResponse === 'pagging')
						? [...state, ...data]
						: action.response;
				}
				// for verify-activity

				// case GroupActionType.CHECK_ALL_ACTIVITIES: {
				//	 if (!state.length)	return state;
				//
				//	 const flag = state.every(item => item.checked);
				//	 return state.map(item => ({...item, checked: !flag}))
				// }
				// for verify-applyList
				case CHECK_APPLICANT: {
					return state.map((item) => {
						if (action.pid === item.pid)
							return {...item, checked: !item.checked};
						return item;
					});
				}
				case CHECK_ALL_APPLICANTS: {
					if (!state.length)	return state;

					const flag = state.every(item => item.checked);
					return state.map(item => ({...item, checked: !flag}));
				}
				case VERIFYING_MEMBERS: {
					const { pids } = action;
					return state.map((item) => {
						if (pids.includes(item.pid))
							return {...item, loading: true};
						return item;
					});
				}
				case VERIFY_MEMBER_SUCCESS: {
					const { pids } = action;
					return state.filter(item => pids.indexOf(item.pid) === -1);
				}
				case VERIFY_MEMBER_ERROR: {
					const { pids } = action;
					return state.map((item) => {
						if (pids.includes(item.pid))
							return {...item,
									checked: false,
									loading: false,
									error: true
								};
						return item;
					});
				}
				// for groupMembers
				case CHANGE_MEMBER_RULE: {
					const { targetPid, isAdmin } = action;
					return state.map((item) => {
						if (item.pid === targetPid)
							return {...item, isAdmin};
						return item;
					});
				}
				case ON_DELETE_GROUP_MEMBER: {
					const { targetPid } = action;
					return state.filter(item => item.pid !== targetPid);
				}
				// 成員頁面的交友互動
				case REVOKE: {
					const {status} = action;
					return state.map((data) => {
						if (data.pid !== status.targetPid) return data;
						return {...data, connectionStatus: 0};
					});
				}
				case INVITE: {
					const {status} = action;
					return state.map((data) => {
						if (data.pid !== status.targetPid) return data;
						return {...data, connectionStatus: 1};
					});
				}
				case ACCEPT: {
					const {status} = action;
					return state.map((data) => {
						if (data.pid !== status.targetPid) return data;
						return {...data, connectionStatus: 3};
					});
				}
				case REJECT: {
					const {status} = action;
					return state.map((data) => {
						if (data.pid !== status.targetPid) return data;
						return {...data, connectionStatus: 0};
					});
				}
				// for clearData
				case CLEAR_DATA:
					return [];
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function dataInfo(category) {
	return function dataInfoReducer(state = {}, action) {
		try{	
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case UPDATE_GROUP_INFO:
				case RECEIVE_DATA:
					return action.response.id;
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function nextFrom(category) {
	return function nextFromReducer(state = 0, action) {
		try{
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case RECEIVE_DATA:
					return action.response.nextFrom || state;
				case CLEAR_DATA: {
					return 0;
				}
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function total(category) {
	const styleOfResponse = responseModel[category];
	return function totalReducer(state = 0, action) {
		try{
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case RECEIVE_DATA:
					return (styleOfResponse === 'pagging')
						? action.response.total
						: action.response.length;
				case CLEAR_DATA:
					return 0;
				case ON_DELETE_GROUP_MEMBER:
					return state - 1;
				// for applyList
				case VERIFY_MEMBER_SUCCESS: {
					const { pids } = action;
					return state - pids.length;
				}
				// for delete-activity
				case DELETE_ACTIVITY_SUCCESS: {
					const { aidList } = action;
					return state - aidList.length;
				}
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function count(category) {
	return function countReducer(state = 0, action) {
		try{
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case RECEIVE_DATA: {
					const dataList = dataListPreprocess(category, action.response);
					const length = dataList ? dataList.length : 0;
					return state + length;
				}
				case CLEAR_DATA:
					return 0;
				case ON_DELETE_GROUP_MEMBER:
					return state - 1;
				// for applyList
				case VERIFY_MEMBER_SUCCESS: {
					const { pids } = action;
					return state - pids.length;
				}
				// for delete-activity
				case DELETE_ACTIVITY_SUCCESS: {
					const { aidList } = action;
					return state - aidList.length;
				}
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function offset(category) {
	return function offsetReducer(state = 0, action) {
		try{
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case RECEIVE_DATA: {
					return action.response.offset;
				}
				case CLEAR_DATA:
					return 0;
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function error(category) {
	return function errorReducer(state = false, action) {
		try{
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case RECEIVE_FAIL:
					return true;
				case REQUEST_DATA:
				case RECEIVE_DATA:
				case CLEAR_DATA:
					return false;
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function loading(category) {
	return function loadingReducer(state = false, action) {
		try{	
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case RECEIVE_FAIL:
				case RECEIVE_DATA:
				case CLEAR_DATA:
					return false;
				case REQUEST_DATA:
					return true;
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function end(category) {
	return function endReducer(state = false, action) {
		try{	
			if (category !== action.category) {
				return state;
			}
			switch (action.type) {
				case REACH_END:
					return true;
				case CLEAR_DATA:
					return false;
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}
export function myGroupTitleList(category) {
	return function myGroupTitleListReducer(state = [
		{title: 'joined', total: 0},
		{title: 'waitForJoin', total: 0},
		{title: 'managed', total: 0},
		{title: 'checking', total: 0},
		{title: 'rejected', total: 0}
	], action) {
		try{
			if (category !== action.category)
				return state;

			const { response } = action;
			const selectNonEmpty = (final, curr) => {
				if (!response[curr].total) return final;
				return [...final, {
					title: curr, total: response[curr].total
				}];
			};

			switch (action.type) {
				case RECEIVE_DATA: {
					return Object.keys(response).reduce(selectNonEmpty, []);
				}
				default:
					return state;
			}
		}catch(e){
			console.log(e)
			return state;
		}
	};
}

export function createCategoryList(category) {
	return combineReducers({
		dataList: dataList(category),
		total: total(category),
		count: count(category),
		offset: offset(category),
		error: error(category),
		loading: loading(category),
		end: end(category)
	});
}
