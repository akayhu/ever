import { combineReducers } from 'redux';
import tabInfo from './tabInfo';
import joined from './joined';
import created from './created';
import waitForReset from './waitForReset';
import tab from './tab';
import groupNewActvity from './groupNewActvity';
import allGroup from './allGroup';
import myGroup from './myGroup';
import groupInfo from './groupInfo';
import categoryTitles from './categoryTitles';
import recommend from './recommend';
import entities from './entities';

const group = combineReducers({
	recommend,
	myGroup,
	allGroup,
	groupInfo,
	categoryTitles,
	tabInfo,
	joined,
	created,
	waitForReset,
	tab,
	groupNewActvity,
	entities
});

export default group;

// selectors
export const getDataList = (state, category) => {
// 因為目前不是所有dataList都存社團id，因此需要抽出來特別處理
	if (inAllGroup(category)) {
		return state.allGroup[category].dataList.map(id => state.entities[id]);
	}
	if (inMyGroup(category) && category !== 'myGroupTitle') {
		return state.myGroup[category].dataList.map(id => state.entities[id]);
	}
	return state.groupInfo[category].dataList;
}
export const getDataTotal = (state, category) => transByCategory(state, category, 'total');
export const getIsLoading = (state, category) => transByCategory(state, category, 'loading');
export const getCurrentCount = (state, category) => transByCategory(state, category, 'count');
export const getIsError = (state, category) => transByCategory(state, category, 'error');
export const getIsEnd = (state, category) => transByCategory(state, category, 'end');
export const getMainTab = state => state.tabInfo.main;
export const getSubTab = (state, subName) => state.tabInfo[subName];
export const getGroupInfo = state => state.groupInfo;
export const getGroupInfoData = state => getGroupInfo(state).dataInfo;
export const getMyGroupTitleList = state => state.myGroup.myGroupTitle.titleList;
export const getObserverRule = state => getGroupInfo(state).observerRule;
export const getVerifyStatus = state => getGroupInfo(state).groupActivityForCheck.verifyStatus;
export const getChannelId = state => getGroupInfo(state).dataInfo.id;
export const getSearchKeyWord = state => getGroupInfo(state).search;
// activity
export const getNextFrom = (state, category) => transByCategory(state, category, 'nextFrom');
// utils
export function inAllGroup(category) {
	return ['knowAndTech', 'lifestyle', 'healthAndLeisure', 'artAndDesign'].indexOf(category) !== -1;
}

export function inMyGroup(category) {
	return ['myGroupTitle', 'joined', 'waitForJoin', 'managed', 'checking', 'rejected'].indexOf(category) !== -1;
}
function inGroupInfo(category) {
	return ['groupActivityForCheck', 'groupActivity', 'groupMembers', 'groupAdmins', 'searchMembers', 'applyList'].indexOf(category) !== -1;
}
function transByCategory(state, category, key) {
	if (inAllGroup(category)) return state.allGroup[category][key];
	if (inMyGroup(category)) return state.myGroup[category][key];
	if (inGroupInfo(category)) return state.groupInfo[category][key];

	return state[category][key];
}

