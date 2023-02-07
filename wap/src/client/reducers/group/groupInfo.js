import { combineReducers } from 'redux';
import {CLEAR_DATA} from '../../actions/group';
import {
	dataInfo,
	count,
	loading,
	error,
	end,
	nextFrom,
	createCategoryList
} from './unitReducers';
import {default as tab} from './groupTab';
import {default as search} from './groupSearch';
import observerRule from './observerRule';
import verifyStatus from './verifyStatus';

const groupActivity = combineReducers({
	loading: loading('groupActivity'),
	error: error('groupActivity'),
	end: end('groupActivity'),
	nextFrom: nextFrom('groupActivity')
});

const groupActivityForCheck = combineReducers({
	verifyStatus,
	loading: loading('groupActivityForCheck'),
	count: count('groupActivityForCheck'),
	error: error('groupActivityForCheck'),
	end: end('groupActivityForCheck'),
	nextFrom: nextFrom('groupActivityForCheck')
});

const _groupInfo = combineReducers({
	groupActivity,
	groupActivityForCheck,
	observerRule,
	tab,
	search,
	dataInfo: dataInfo('groupInfo'),
	applyList: createCategoryList('applyList'),
	groupMembers: createCategoryList('groupMembers'),
	groupAdmins: createCategoryList('groupAdmins'),
	searchMembers: createCategoryList('searchMembers'),
	loading: loading('groupInfo'),
	error: error('groupInfo'),
});

const initState = _groupInfo(undefined, {type: 'GET_INITIAL_STATE'});

const groupInfo = (state = initState, action) => {
	switch (action.type) {
		case CLEAR_DATA: {
			if (action.category === 'groupInfo') {
				return initState;
			}
			return state;
		}
		default:
			return _groupInfo(state, action);
	}
};

export default groupInfo;
