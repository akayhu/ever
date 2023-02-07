export const getDataList = (state, category) => {
// 因為目前不是所有dataList都存社團id，因此需要抽出來特別處理
	if (inAllGroup(category)) {
		return state.allGroup[category].dataList.map(id => state.entities[id]);
	}
	if (inMyGroup(category)) {
		if (category === 'myGroupTitle') {
			return state.myGroup.myGroupTitle.dataList;
		}
		return state.myGroup[category].dataList.map(id => state.entities[id]);
	}
	if (inGroupInfo(category)) return state.groupInfo[category].dataList;

	return state[category].dataList;
};
export const getDataTotal = (state, category) => transByCategory(state, category, 'total');
export const getIsLoading = (state, category) => transByCategory(state, category, 'loading');
export const getCurrentCount = (state, category) => transByCategory(state, category, 'count');
export const getCurrentOffset = (state, category) => transByCategory(state, category, 'offset');
export const getIsError = (state, category) => transByCategory(state, category, 'error');
export const getIsEnd = (state, category) => transByCategory(state, category, 'end');
export const getMainTab = state => state.tabInfo.main;
export const getSubTab = (state, subName) => state.tabInfo[subName];
export const getGroupInfo = state => state.groupInfo;
export const getGroupInfoData = state => state.entities[getGroupInfo(state).dataInfo] || {};
export const getGrouptTab = state => getGroupInfo(state).tab;
export const getSearchKeyWord = state => getGroupInfo(state).search;
export const getGroupMemberSearchKey = state => getGroupInfo(state).search.memberKeyWord;
export const getGroupActivitySearchKey = state => getGroupInfo(state).search.activityKeyWord;
export const getObserverRule = state => getGroupInfo(state).observerRule;
export const getVerifyStatus = state => getGroupInfo(state).groupActivityForCheck.verifyStatus;
export const getChannelId = state => getGroupInfo(state).dataInfo;
export const getMyGroupTitleList = state => state.myGroup.myGroupTitle.titleList;
export const getSortFieldAndOrder = state => ({
	sortField: getVerifyStatus(state).sortField,
	order: getVerifyStatus(state).sortOrder
});

// activity
export const getNextFrom = (state, category) => transByCategory(state, category, 'nextFrom');
// utils
export function inAllGroup(category) {
	return ['knowAndTech', 'lifestyle', 'healthAndLeisure', 'artAndDesign'].indexOf(category) !== -1;
}

export function inMyGroup(category) {
	return ['myGroupTitle', 'joined', 'waitForJoin', 'managed', 'checking', 'rejected'].indexOf(category) !== -1;
}
export function inGroupInfo(category) {
	return ['groupActivityForCheck', 'groupActivity', 'groupMembers', 'groupAdmins', 'searchMembers', 'applyList'].indexOf(category) !== -1;
}

function transByCategory(state, category, key) {
	if (inAllGroup(category)) return state.allGroup[category][key];
	if (inMyGroup(category)) return state.myGroup[category][key];
	if (inGroupInfo(category)) return state.groupInfo[category][key];

	return state[category][key];
}
